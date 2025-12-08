## [23.11.2025]
- Створив CHANGELOG.md, тепер вся інфа про патч буде тут
- Видалив інфу про патч з README.md
- Створив ProfilePage, як компонент, так і в App.jsx додав
- В UserAvatar стояла лишня точка перед /, видалив її, тепер тестове фото грузиться корректно завжди
- Прибрав pfp пропс з Header
- Створив UserFrame, тепер аватарка може мати гарну обводку
- UserAvatar розміри тепер задаються в пропсах, також додав hasFrame і ссилку на потрібний фрейм, яка передається самому UserFrame
- Іконка ProfileIcon в HeaderOptions змінена + з'явилась опція Menu
## [24.11.2025]
- В HeaderOptions додав нову опцію Market, а також покращив поведінку курсору і поправив alt`s у деяких img
- Видалив вкладку Options, оскільки для MVP вона не потрібна
- В Header додав gap 12px
- В UserAvatar додав fit-content ширину, так фрейм накладається краще
- Оновив Page404, додав компоненти Space(Фон Lootie), Planet(Надпис 404 Lootie), Text(Текст, що такої сторінки не існує)
- Додав z-index -1, щоб HeaderOptions корректно відображались
## [25.11.2025]
- Button component is fixed, now it works correctly
## [28.11.2025]
- Refactored Button component (cleaner structure)
- Added AnimatedButton component (separate button for animations)
- Fixed layout issues on 404 page by removing unnecessary absolute positioning
## [01.12.2025]
- Видалив компонент FindGameButton в MainPage > myComponents, замість неї тепер Button виконує її функції (можливо тимчасово), додав до нього position + 't,l,r,b'
- Створив UniversalContainer, контейнер для верстки сторінки в котрий можна вставляти без проблем фон, стилі та класи
- Видалив компонент ContentContainer в MainPage > myComponents, замість нього тепер UniversalContainer
## [08.12.2025]
- ProfilePage повністю створена і працює, для MVP працює як треба
- Створив UserDescription && UserName в ForFetch папці