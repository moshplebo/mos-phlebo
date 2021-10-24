SitemapGenerator::Sitemap.default_host = 'https://doctorkalachev.ru'
SitemapGenerator::Sitemap.compress = false

SitemapGenerator::Sitemap.create do
  root = Page.find_by(material_path: '/')

  root.descendants.all.each do |page|
    add page.material_path, lastmod: page.updated_at
  end
end
