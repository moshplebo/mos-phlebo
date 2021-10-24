# lorem_ipsum = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
#  industry's standard dummy"
#
# Page.destroy_all
# MediaFile.destroy_all
# MediaFolder.all.reverse.map(&:destroy)
# Photo.destroy_all
# PhotoCategory.destroy_all
# StaticPage.destroy_all
# Article.destroy_all
# Healing.destroy_all
# Comment.destroy_all
#
# Page.create!(name: 'Главная', slug: 'index', kind: 'MainPage', title: 'Флеболог Калачев', active: true)
#
# vash_vrach = StaticPage.create!(name: 'Ваш врач')
# StaticPage.create!(name: 'Сертификаты', parent_id: vash_vrach.id)
# StaticPage.create!(name: 'Практическая деятельность', parent_id: vash_vrach.id)
# StaticPage.create!(name: 'Конференции', parent_id: vash_vrach.id)
# StaticPage.create!(name: 'Повышение квалификации', parent_id: vash_vrach.id)
#
# photo_folder = MediaFolder.create!(name: 'Изображения', slug: 'images', file_type: 'MediaImage')
#
# news_page = Page.create!(slug: 'articles', parent_id: Page.first.id, active: true, name: 'О варикозе',
#                          title: 'Статьи о варикозе', h1: 'Статьи о варикозе', kind: 'Collection')
# Collection.create!(slug: 'articles', page: news_page, collectionable_type: 'Article', name: 'Статьи о варикозе')
# news_names = ['Статья о варикозе 1-ая', 'Статья о варикозе 2-ая', 'Статья о варикозе 3-ая',
#               'Статья о варикозе 4-ая', 'Статья о варикозе 5-ая', 'Статья о варикозе 6-ая']
# 6.times do |index|
#   Article.create!(
#       name: news_names[index],
#       media_file: MediaImage.create!(
#           media_folder_id: photo_folder.id,
#           file: File.open("#{Rails.root}/db/seeds/photos/#{index + 1}.jpg", 'rb'),
#           name: "article#{index + 1}"
#       ),
#       published_at: Time.now - index.days,
#       metadata: {}
#   )
# end
#
# healings_page = Page.create!(slug: 'healings', parent_id: Page.first.id, active: true, name: 'Методы лечения',
#                              title: 'Методы лечения', h1: 'Методы лечения', kind: 'Collection')
# Collection.create!(slug: 'healings', page: healings_page, collectionable_type: 'Healing', name: 'Методы лечения')
# healings_names = ['Радиочастотная облитерация', 'Лазерная облитерация', 'Минифлебэктомия', 'Склеротерапия',
#                   'Foam-form склеротерапия', 'Микротермокоагуляция', 'Удаление лазером', 'Озоносклеротерапия']
# healings_names.length.times do |index|
#   Healing.create!(
#       name: healings_names[index],
#       metadata: {}
#   )
# end
#
# inog = StaticPage.create!(name: 'Иногородним пациентам')
# StaticPage.create!(name: 'Обследование перед операцией', parent_id: inog.id)
# StaticPage.create!(name: 'Проживание', parent_id: inog.id)
#
# oper = StaticPage.create!(name: 'Современные операции')
# StaticPage.create!(name: 'Пункт 1', parent_id: oper.id)
# StaticPage.create!(name: 'Пункт 2', parent_id: oper.id)
# StaticPage.create!(name: 'Пункт 3', parent_id: oper.id)
# StaticPage.create!(name: 'Пункт 4', parent_id: oper.id)
#
# photo_category = [
#     PhotoCategory.create!(position: 1, name: 'До и после лечения'),
#     PhotoCategory.create!(position: 2, name: 'Клиника Экспертных медицинских технологий'),
#     PhotoCategory.create!(position: 3, name: 'Другое')
# ]
#
# 6.times do |index|
#   mf = MediaFile.create!(
#       media_folder_id: photo_folder.id,
#       type: 'MediaImage',
#       file: File.open("#{Rails.root}/db/seeds/photos/#{index + 1}.jpg", 'rb'),
#       name: "photo_#{Time.now.to_i}.#{Time.now.usec}"
#   )
#   3.times do |i|
#     photo_category[i].photos.create!(
#         photo_category_id: 1,
#         media_file: mf,
#         position: index + 1,
#         metadata: {
#             header: 'Варикозные вены',
#             text: 'Распространённость варикозной болезни необычайно широкая. По данным разных авторов, в той или иной
#  степени выраженности её признаки имеют до 89% женщин и до 66% мужчин из числа жителей разных стран. Большое
# исследование, выполненное в 1999 году в Эдинбурге показало наличие варикозно расширенных вен нижних конечностей у 40%
#  женщин и 32% мужчин.'
#         }
#     )
#   end
# end
#
# Page.create!(slug: 'prices', parent_id: Page.first.id, active: true, name: 'Цены',
#                          title: 'Стоимость лечения', h1: 'Стоимость лечения', kind: 'PricesPage')
#
# 5.times do |index|
#   mf = MediaFile.create!(
#       media_folder_id: photo_folder.id,
#       type: 'MediaImage',
#       file: File.open("#{Rails.root}/db/seeds/comments/#{index + 1}.JPG", 'rb'),
#       name: "comment_#{Time.now.to_i}.#{Time.now.usec}"
#   )
#   Comment.create!(media_file: mf, fio: 'Иванов Иван Иванович', text: lorem_ipsum, date: Time.now)
# end
#
# Page.create!(name: 'Контакты', slug: 'kontakty', kind: 'Contacts', title: 'Контакты', active: true)
#
# news_page = Page.create!(slug: 'novelties', parent_id: Page.first.id, active: true, name: 'Новости',
#                          title: 'Новости', h1: 'Новости', kind: 'Collection')
# Collection.create!(slug: 'novelties', page: news_page, collectionable_type: 'Novelty', name: 'Новости')
# Contact.create!(metadata: {
#     first_url: '',
#     middle_url: '',
#     last_url: '',
#     content: ''
# })
