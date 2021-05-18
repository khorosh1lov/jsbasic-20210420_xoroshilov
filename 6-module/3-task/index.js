import createElement from '../../assets/lib/create-element.js';

const PRODUCT_ADD_EVENT = 'product-add';

function slidesDataTemplate(slides) {
  return slides.map(({ name, id, price, image }) => slideTemplate({ name, id, price, image })).join('');
}

function slideTemplate({ name, id, price, image }) {
  return `
    <div class="carousel__slide" data-id="${id}">
      <img src="/assets/images/carousel/${image}" class="carousel__img" alt="slide">
      <div class="carousel__caption">
        <span class="carousel__price">€${price.toFixed(2)}</span>
        <div class="carousel__title">${name}</div>
        <button type="button" class="carousel__button" data-action="add">
          <img src="/assets/images/icons/plus-icon.svg" alt="icon">
        </button>
      </div>
    </div>
  `;
}

function carouselContainerTemplate(slides) {
  return `
  <div class="carousel">
    ${arrowsTemplate()}
    <div class="carousel__inner">
      ${slides}
    </div>
  </div>
  `;
}

function arrowsTemplate() {
  return `
    <div class="carousel__arrow carousel__arrow_right">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </div>
    <div class="carousel__arrow carousel__arrow_left">
      <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
    </div>
  `;
}

export default class Carousel {
  constructor(slides) {
    this._slides = slidesDataTemplate(slides);
    this.elem    = createElement(carouselContainerTemplate(this._slides));

    this._carousel       = this.elem.querySelector('.carousel__inner');
    this._arrowLeft      = this.elem.querySelector('.carousel__arrow_left');
    this._arrowRight     = this.elem.querySelector('.carousel__arrow_right');
    this._totalSlides    = this.elem.querySelectorAll('.carousel__slide').length;
    this._addButtons     = this.elem.querySelectorAll('[data-action="add"]');
    this._slidePosition  = 0;

    if (this._totalSlides <= 1) { this._disableArrows(this._arrowLeft, this._arrowRight); }

    this._checkSlidePosition();
    this._arrowLeft.addEventListener('click', this._prevSlide);
    this._arrowRight.addEventListener('click', this._nextSlide);

    for (let _addButton of this._addButtons) {
      _addButton.addEventListener('click', this._onAddButtonClick);
    }
  }

  get elem() {
    return this._elem;
  }

  set elem(value) {
    this._elem = value;
  }

  _checkSlidePosition = () => {
    if (this._slidePosition === 0) { return this._disableArrows(this._arrowLeft); }
    this._arrowLeft.style.display = '';

    if (this._slidePosition === this._totalSlides - 1) { return this._disableArrows(this._arrowRight); }
    this._arrowRight.style.display = '';
  }

  _shiftSlide = () => {
    let shiftIn = -this._carousel.offsetWidth * this._slidePosition;
    this._carousel.style.transform = `translateX(${shiftIn}px)`;
  }

  _prevSlide = () => {
    this._slidePosition--;
    this._checkSlidePosition();
    this._shiftSlide();
  }

  _nextSlide = () => {
    this._slidePosition++;
    this._checkSlidePosition();
    this._shiftSlide();
  }

  _disableArrows = (...arrows) => {
    for (let arrow of arrows) {
      arrow.style.display = 'none';
    }
  }

  _onAddButtonClick = (e) => {
    const id = e.target.closest(`[data-id]`).dataset.id;

    let event = new CustomEvent(PRODUCT_ADD_EVENT, {
      detail: id,
      bubbles: true
    });
    this.elem.dispatchEvent(event);
  }
}
