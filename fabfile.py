from fabric2 import Connection
from invoke import task
import os

@task
def deploy(c, branch='master', directory='mos-phlebo', compile='true'):
    with Connection('root@s1.web-creator.ru:16122') as c:
        code_dir = '/var/www/' + directory
        service = directory + ".service"
        sidekiq_service = directory + "_sidekiq.service"

        if not c.run("cd {} && git fetch origin".format(code_dir), warn=True):
            c.run("git clone git@git.web-creator.ru:bolotov/mos-phlebo.git {}".format(code_dir))

        c.run("cd {} && git fetch origin".format(code_dir))
        c.run("cd {} && git checkout -f {}".format(code_dir, branch))
        c.run("cd {} && git pull origin {}".format(code_dir, branch))
        if not c.run("test -d {}/tmp/pids".format(code_dir), warn=True):
            c.run("cd {} && mkdir -p tmp/pids".format(code_dir))
        c.run("cd {} && bundle install".format(code_dir))
        c.run("cd {} && rails tmp:cache:clear db:migrate RAILS_ENV=production".format(code_dir))
        if (compile == 'true'):
            c.run("cd {} && yarn install".format(code_dir))
            upload_assets(c, directory)
        c.run('cd {} && rails app:cache_clear RAILS_ENV=production'.format(code_dir))
        c.run("cd {} && whenever --update-crontab".format(code_dir))
        c.run("systemctl restart phlebo")

@task
def upload_assets(c, directory):
    shell = os.environ['SHELL']
    
    c.run("mkdir -p {}/public/webpack".format(directory))
    local_dir = os.path.dirname(os.path.realpath(__file__))
    c.local('echo "Start scp"')
    c.local("scp -P 16122 -r {}/public/webpack root@s1.web-creator.ru:{}/public".format(local_dir, directory))
    c.local('echo "Clean assets"')
    c.run('cd {} && rails app:clean_assets RAILS_ENV=production'.format(directory))
    c.local('echo "RM local assets"')
    c.local("rm -rf public/webpack")