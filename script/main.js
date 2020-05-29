const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');


const DBService = class {
    getData = async (url) => {
        const res = await fetch(url)
        if (res.ok) {
            return res.json()
        } else {
            throw new Error (`Failed to receive data from ${url}; Error ${res.status}`)
        }
    }
    getTestData = () => {
        return this.getData('test.json')
    }
};

const renderCard = response => {
    console.log(response)
    tvShowsList.textContent='';     //clear film list

    response.results.forEach(item => {
        
        const {
                backdrop_path : backdrop,
                name : title, 
                poster_path : poster, 
                vote_average: vote
                } = item;
        
        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg' ;
        const backdropIMG = backdrop ? IMG_URL + backdrop : 'img/no-poster.jpg';

        const voteDel = tvShowsList.querySelector('.tv-card__vote');
        const voteElem = (vote === 0) ? (voteDel.style.visibility = 'none') : vote;
        //const voteElem = (vote === 0) ? voteDel.classList.add('hide') : vote;

        const card = document.createElement('li')
        card.className = 'tv-shows__item';
        card.innerHTML = `
            <a href="#" class="tv-card">
            <span class="tv-card__vote">${voteElem}</span>
            <img class="tv-card__img"
                src="${posterIMG}"
                data-backdrop="${backdropIMG}"
                alt="${title}">
            <h4 class="tv-card__head">${title}</h4>
            </a>
        `;

        tvShowsList.append(card);
        //tvShowsList.insertAdjacentElement('afterbegin', card)
    });
};

new DBService().getTestData().then(renderCard);

//open-close menu

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', (event) => {

    if(!event.target.closest('.left-menu')){
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});

leftMenu.addEventListener('click', () => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');

    if(dropdown){
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});

// open modal window

tvShowsList.addEventListener('click', event => {

    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');

    if (card) {
        document.body.style.overflow = 'hidden'; //delete scrollbar
        modal.classList.remove('hide');
    }
});

// close modal window

modal.addEventListener('click', event => {

    if (event.target.closest('.cross') || event.target.classList.contains('modal')){
        document.body.style.overflow = ''; 
        modal.classList.add('hide');
    }


});

//change of images

const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');

    if (card) {
        const img = card.querySelector('.tv-card__img');

        /*      
        //one solution

            const changeImg = img.dataset.backdrop;
            if (changeImg) {
                img.dataset.backdrop = img.src;
                img.src = changeImg;
            }
        */

        // second solution with desctructurisation
        if (img.dataset.backdrop){
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src]
        }
    }
};

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);


