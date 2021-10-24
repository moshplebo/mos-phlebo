set :output, './log/cron.log'

every 1.day, at: '6am' do
  rake 'sitemap:refresh'
end
