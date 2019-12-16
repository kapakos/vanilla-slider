document.addEventListener("DOMContentLoaded", function(){
    getImages(function(data) {
        var sliderContainer = createSliderContainer();
        createImageContainers(data, sliderContainer);
        createSliderControls(sliderContainer);
        createNavigator(sliderContainer);
        createPlay(sliderContainer);
    });
});

function createPlay(sliderContainer) {
    var autoplay = utils.createElement('span', {id: 'slider__autoplay'}, document.createTextNode('PLAY'));
    var isAutoplayEnabled = false;
    var intervalId;
    autoplay.addEventListener('click', function () {
        isAutoplayEnabled = !isAutoplayEnabled;
        var images = sliderContainer.getElementsByTagName('img');

        if(isAutoplayEnabled){
            intervalId = setInterval(function () {
                // @todo implement autoplay with modulo operation -> images.length % currentIndex =
                var currentIndex = getVisibleImageIndex(images);
                toggleImage(images, currentIndex, currentIndex+1)
            }, 2000);
        } else {
            clearInterval(intervalId);
        }
    });
    sliderContainer.appendChild(autoplay);
}

function createNavigator(sliderContainer){
    var navigator = utils.createElement('div', {class: 'image-navigator'});
    var images = sliderContainer.getElementsByTagName('img');
    utils.arrayFor(images, function(image, index){
        var activeClass = index === 0 ? 'image-navigator__item_active' :'image-navigator__item_inactive';
        var imageNavigator = utils.createElement('span', {id: image.id + '_nav', class: 'image-navigator__item ' + activeClass});
        imageNavigator.addEventListener('click', function(){
            var currentIndex = getVisibleImageIndex(images);
            toggleImage(images, currentIndex, index);
        });
        navigator.appendChild(imageNavigator);
    });
    sliderContainer.appendChild(navigator);
}

function createSliderContainer() {
    var sliderContainer = utils.createElement('div', {id: 'slider-container'});
    var slider = document.getElementById('slider');
    slider.appendChild(sliderContainer);

    return sliderContainer;
}

function getVisibleImageIndex(images) {
    return utils.getIndexOf(images, function(image) {
        return image.getAttribute('class').indexOf('show') >= 0;
    });
}

function toggleImage(images, currentIndex, next){
    utils.hideElements([images[currentIndex]]);
    utils.showElements([images[next]]);

    toggleNavigatorItems(currentIndex, next);

    setControlVisibility(next, images);
}

function toggleNavigatorItems(currentIndex, nextIndex) {
    var navigator = document.getElementsByClassName('image-navigator__item');
    navigator[currentIndex].setAttribute('class', navigator[currentIndex].getAttribute('class').replace('image-navigator__item_active', 'image-navigator__item_inactive'));
    navigator[nextIndex].setAttribute('class', navigator[nextIndex].getAttribute('class').replace('image-navigator__item_inactive', 'image-navigator__item_active'));
}

function setControlVisibility(index, images) {
    var left = document.getElementsByClassName('slider_control_left')[0];
    var right = document.getElementsByClassName('slider_control_right')[0];

    var isFirstImageInSlider = index === 0;
    var isLastImageInSlider = index === images.length-1;
    var isImageInBetween = index > 0 && index < images.length -1;
    if(isFirstImageInSlider){
        utils.hideElements([left]);
        utils.showElements([right]);
    } else if(isLastImageInSlider){
        utils.hideElements([right]);
        utils.showElements([left])
    } else if(isImageInBetween){
        utils.showElements([left, right]);
    }
}

function createSliderControls(sliderContainer) {
    var rightTextNode = document.createTextNode('NEXT');
    var leftTextNode = document.createTextNode('PREV');

    var right = utils.createElement('span', {class: 'slider_control slider_control_right show'});
    var left = utils.createElement('span', {class: 'slider_control slider_control_left hide'});

    right.appendChild(rightTextNode);
    left.appendChild(leftTextNode);

    var images = sliderContainer.getElementsByTagName('img');

    right.addEventListener('click', function(){
        var currentIndex = getVisibleImageIndex(images);
        toggleImage(images,currentIndex,currentIndex+1);
    });

    left.addEventListener('click', function(){
        var currentIndex = getVisibleImageIndex(images);
        toggleImage(images,currentIndex, currentIndex-1);
    });

    sliderContainer.appendChild(right);
    sliderContainer.appendChild(left);
    return sliderContainer;
}

function createImageContainers(data, sliderContainer) {
    utils.arrayFor(data, function(el, index){
        var visibilityClass = index === 0 ? 'show' : 'hide';
        var image = utils.createElement('img', { id: el.id, src: el.url, class: 'image ' + visibilityClass });
        var imageContainer = utils.createElement('span', {id: el.id + '_image_container', class: 'image__container'});
        imageContainer.appendChild(image);
        sliderContainer.appendChild(imageContainer);
    });
    return sliderContainer;
}

var utils = {
    createElement: function createElement(tag ='div', attr, children) {
        let el = document.createElement(tag);

        for(let att in attr) {
            if(attr.hasOwnProperty(att)){
                el.setAttribute(att,attr[att]);
            }
        }
        if(children){
            el.appendChild(children);
        }
        return el;
    },
    hideElements: function hideElements(elements) {
        this.arrayFor(elements, function(el){
            el.setAttribute('class', el.getAttribute('class').replace('show', 'hide'));
        });
    },
    showElements: function showElements(elements){
        this.arrayFor(elements, function(el){
            el.setAttribute('class', el.getAttribute('class').replace('hide', 'show'));
        });
    },
    getIndexOf: function getIndexOf(list, f) {
        for(var i =0; i < list.length; i++){
            if(!!f(list[i])){
                return i;
            }
        }
    },
    arrayFor: function arrayFor(arr, f){
        for(let i = 0; i < arr.length; i++){
            f(arr[i], i);
        }
    }
};

function getImages(callback){
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function(event) {
        if(xhr.status >= 200 && xhr.status <= 300 && xhr.statusText === "OK") {
            var response = JSON.parse(xhr.responseText);
            callback(response.images);
        } else {
            console.log('The request failed');
        }
    });

    xhr.addEventListener('error', function(event) {
        console.log('Error. Loading images failed')
    });

    xhr.open('GET', 'http://www.splashbase.co/api/v1/images/latest');
    xhr.send();
}