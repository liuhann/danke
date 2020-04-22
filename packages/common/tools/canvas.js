JSON.stringify(Array.from(document.querySelectorAll('img')).map(img => img.src))

Array.from(document.querySelectorAll('img')).map(img => img.src).filter(src => src.endsWith('tl.png')).map(src=> src.replace('tl.png', 's.svg')).join('\n')

JSON.stringify(Array.from($('.icon--holder img')).map(img => img.getAttribute('srcset').replace(/ 4x/g, '')))


