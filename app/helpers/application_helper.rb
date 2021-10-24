module ApplicationHelper
  def react_app(props = {}, options = {}, &block)
    options = { tag: options } if options.is_a?(Symbol)

    prerender_options = options[:prerender]
    block = proc { concat react_component_render(props) } if prerender_options

    html_options = options.reverse_merge(data: {})
    html_tag = html_options[:tag] || :div
    html_options.except!(:tag, :prerender)

    content_tag(html_tag, '', html_options, &block)
  end

  def react_component_render(props)
    if !Rails.env.production? || !defined?(@@exec_js_context)
      js_code = ''

      webpack_asset_paths('server_render', extension: 'js').each do |asset|
        if Rails.env.production?
          js_code += open("#{Rails.root}/public#{asset}").read
        else
          uri = URI.parse(asset)
          uri.host = '127.0.0.1'
          js_code += Net::HTTP.get(uri)
        end
      end

      global_wrapper = <<-JS
        var global = global || this;
        var self = self || this;
        var window = window || this;
        var navigator = {};
        navigator.userAgent = '#{request.env['HTTP_USER_AGENT']}';
      JS

      js_code.force_encoding('UTF-8')

      @@exec_js_context = ExecJS.compile(global_wrapper + js_code)

    end
    js_code = <<-JS
          (function () {
            return serverRender(#{props.to_json});
          })()
    JS

    @@exec_js_context.eval(js_code).html_safe

  rescue ExecJS::ProgramError => err
    raise Exception, err
  end
end
