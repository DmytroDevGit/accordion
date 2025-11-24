class Accordion {
	constructor({
                activeClass = 'active',
                container = '.accordion-container',
                holder = '.accordion-floating-holder',
                opener = '.accordion-slide-opener',
                slider = '.accordion-slide',
                btnClose = '.accordion-slide-close',
                animSpeed = 400,
                event = 'click',
              }) {
		this.container = container;
		this.holder = holder;
		this.activeClass = activeClass;
		this.opener = opener;
		this.slider = slider;
		this.btnClose = btnClose;
		this.animSpeed = animSpeed;
		this.event = event;
    	this.isAnimating = false;
		this.init();
	}

  init() {
    if (document.querySelector(this.container)) {
      this.findElements();
      this.attachEvents();
      this.container.style.setProperty('--containerWidth', this.container.clientWidth);
    }
  }

  findElements() {
    this.container = document.querySelector(this.container);
    this.holders = this.container.querySelectorAll(this.holder);
  }

  attachEvents() {
    this.holders.forEach((holder) => {
      holder.slide = holder.querySelector(this.slider);
      const btnClose = holder.slide.querySelector(this.btnClose);

      holder.addEventListener(this.event, (e) => {
        if (e.target?.classList.contains(this.opener.slice(1)) || e.target.closest(this.opener)) {
          e.preventDefault();
          this.switchSlides(holder);
        }
      });

      btnClose?.addEventListener(this.event, (e) => {
        e.preventDefault();
        this.hideSlide(holder);
      });
    });

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  onWindowResize() {
    const activeItem = [...this.holders].filter(holder => holder.classList.contains(this.activeClass))[0];
    this.container.style.setProperty('--containerWidth', this.container.clientWidth);

    if (activeItem) {
      activeItem.slideHolder.style.display = 'none';
      this.repositionSlide(activeItem);
      activeItem.slideHolder.style.display = 'block';
      activeItem.slideHolder.style.height = '';
    }
  }

  repositionSlide(item) {
    const lastItem = this.getLastItem(item, this.holders);
    const prevItem = item.slideHolder.previousSibling;

    if (!lastItem.isEqualNode(prevItem)) {
      lastItem.insertAdjacentElement('afterend', item.slideHolder);
    }
  }

  switchSlides(item) {
    let activeItem;

    if (!this.isAnimating) {
      if (item.classList.contains(this.activeClass)) {
        this.hideSlide(item);
      } else {
        activeItem = [...this.holders].filter(holder => holder.classList.contains(this.activeClass))[0];
        if (activeItem) {
          if (activeItem.offsetTop === item.offsetTop) {
            this.fadeOutSlide(item, activeItem);
          } else {
            this.hideSlide(activeItem);
            this.showSlide(item);
          }
        } else {
          this.showSlide(item);
        }
      }
    }
  }

  getLastItem(box, boxes) {
    const baseOffset = box.offsetTop;
    const rowBoxes = [];

    boxes.forEach((box) => {
      if (baseOffset === box.offsetTop) {
        rowBoxes.push(box);
      }
    });

    return rowBoxes[rowBoxes.length - 1];
  }

  showSlide(item) {
    this.isAnimating = true;
    let isAnimated = false;

    item.slideHolder = document.createElement("div");
    item.slideHolder.classList.add('custom-slide-holder');
    item.slideHolder.style.opacity = '0';
    item.slideHolder.style.height = '0';
    this.repositionSlide(item);
    item.classList.add(this.activeClass);
    this.container.classList.add('accordion-active');

    item.slideHolder.append(item.slide);

    item.slideHolder.style.transition = `opacity ${this.animSpeed}ms, height ${this.animSpeed}ms`;
    item.slideHolder.style.opacity = '1';
    item.slideHolder.style.height = `${item.slide.clientHeight}px`;

    item.slideHolder.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'height' && !isAnimated) {
        this.isAnimating = false;
      }
    }, false);
  }

  hideSlide(item) {
    this.isAnimating = true;
    let isAnimated = false;

    item.slideHolder.style.transition = `opacity ${this.animSpeed}ms, height ${this.animSpeed}ms`;
    item.slideHolder.style.height = '0';

    item.slideHolder.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'height' && !isAnimated) {
        this.isAnimating = false;
        isAnimated = true;
        item.append(item.slide);
        item.slideHolder.remove();
        item.classList.remove(this.activeClass);
        this.container.classList.remove('accordion-active');
      }
    }, false);
  }

  fadeInSlide(item) {
    this.isAnimating = true;
    let isAnimated = false;

    item.slideHolder = this.container.querySelector('.custom-slide-holder');
    item.slideHolder.append(item.slide)

    item.slideHolder.style.transition = `opacity ${this.animSpeed}ms, height ${this.animSpeed}ms`;
    item.slideHolder.style.opacity = '1';
    item.classList.add(this.activeClass);

    item.slideHolder.style.height = `${item.slide.clientHeight}px`;

    item.slideHolder.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'opacity' && !isAnimated) {
        this.isAnimating = false;
        isAnimated = true;
      }
    }, false );
  }

  fadeOutSlide(item, activeItem) {
    this.isAnimating = true;
    let isAnimated = false;

    activeItem.slideHolder.style.transition = `opacity ${this.animSpeed}ms, height ${this.animSpeed}ms`;
    activeItem.slideHolder.style.height = `${activeItem.slide.clientHeight}px`;
    activeItem.slideHolder.style.opacity = '0';
    activeItem.classList.remove(this.activeClass);

    activeItem.slideHolder.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'opacity' && !isAnimated) {
        isAnimated = true;
        activeItem.append(activeItem.slide);
        activeItem.slideHolder = null;
        this.fadeInSlide(item);
      }
    }, false );
  }
}

export { Accordion as default }
