////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// jQuery
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var mapStyles = [{
    "featureType": "road",
    "elementType": "labels",
    "stylers": [{"visibility": "simplified"}, {"lightness": 20}]
}, {
    "featureType": "administrative.land_parcel",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "landscape.man_made",
    "elementType": "all",
    "stylers": [{"visibility": "on"}]
}, {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [{"saturation": -100}, {"visibility": "on"}, {"lightness": 10}]
}, {"featureType": "road.local", "elementType": "all", "stylers": [{"visibility": "on"}]}, {
    "featureType": "road.local",
    "elementType": "all",
    "stylers": [{"visibility": "on"}]
}, {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [{"visibility": "simplified"}]
}, {"featureType": "poi", "elementType": "labels", "stylers": [{"visibility": "off"}]}, {
    "featureType": "road.arterial",
    "elementType": "labels",
    "stylers": [{"visibility": "on"}, {"lightness": 50}]
}, {
    "featureType": "water",
    "elementType": "all",
    "stylers": [{"hue": "#a1cdfc"}, {"saturation": 30}, {"lightness": 49}]
}, {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{"hue": "#f49935"}]
}, {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [{"hue": "#fad959"}]
}, {
    featureType: 'road.highway',
    elementType: 'all',
    stylers: [{hue: '#dddbd7'}, {saturation: -92}, {lightness: 60}, {visibility: 'on'}]
}, {
    featureType: 'landscape.natural',
    elementType: 'all',
    stylers: [{hue: '#c8c6c3'}, {saturation: -71}, {lightness: -18}, {visibility: 'on'}]
}, {
    featureType: 'poi',
    elementType: 'all',
    stylers: [{hue: '#d9d5cd'}, {saturation: -70}, {lightness: 20}, {visibility: 'on'}]
}];
var $ = jQuery.noConflict();
$(document).ready(function ($) {
    "use strict";

    if ($('body').hasClass('navigation-fixed')) {
        $('.off-canvas-navigation').css('top', -$('.header').height());
        $('#page-canvas').css('margin-top', $('.header').height());
    }

    $('.map-canvas').toggleClass('results-collapsed');

    rating();

    setInputsWidth();

    adaptBackgroundHeight();

    $('.quick-view, .results .item').live('click', function () {
        var id = $(this).attr('id');
        quickView(id);
        return false;
    });

    // Scrollbar on "Results" section

    if ($('.items-list').length > 0) {
        $(".items-list").mCustomScrollbar({
            mouseWheel: {scrollAmount: 350}
        });
    }

    // Bootstrap tooltip

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
//    $('.off-canvas-navigation header').css('line-height', $('.header').height() + 'px');

    // Date & Time picker

    if ($('.input-group.date').length > 0) {
        $('.input-group.date').datepicker({});
    }
    if ($('.input-daterange').length > 0) {
        $('.input-daterange').datepicker({
            todayHighlight: true
        });
    }

//  Bootstrap Select ---------------------------------------------------------------------------------------------------

    var select = $('select');
    if (select.length > 0) {
        select.selectpicker();
    }
    var bootstrapSelect = $('.bootstrap-select');
    var dropDownMenu = $('.dropdown-menu');
    bootstrapSelect.on('shown.bs.dropdown', function () {
        dropDownMenu.removeClass('animation-fade-out');
        dropDownMenu.addClass('animation-fade-in');
    });
    bootstrapSelect.on('hide.bs.dropdown', function () {
        dropDownMenu.removeClass('animation-fade-in');
        dropDownMenu.addClass('animation-fade-out');
    });
    bootstrapSelect.on('hidden.bs.dropdown', function () {
        var _this = $(this);
        $(_this).addClass('open');
        setTimeout(function () {
            $(_this).removeClass('open');
        }, 100);
    });

//  Expand content on click --------------------------------------------------------------------------------------------

    $('.expand-content').live('click', function (e) {
        e.preventDefault();
        var children = $(this).attr('data-expand');
        var parentHeight = $(this).closest('.expandable-content').height();
        var contentSize = $(children + ' .content').height();
        $(children).toggleClass('collapsed');
        $(this).toggleClass('active');
        $(children).css('height', contentSize);
        if (!$(children).hasClass('collapsed')) {
            setTimeout(function () {
                $(children).css('overflow', 'visible');
            }, 400);
        }
        else {
            $(children).css('overflow', 'hidden');
        }
        $('.has-child').live('click', function (e) {
            var parent = $(this).closest('.expandable-content');
            var childHeight = $($(this).attr('data-expand') + ' .content').height();
            if ($(this).hasClass('active')) {
                $(parent).height(parent.height() + childHeight)
            }
            else {
                $(parent).height(parentHeight);
            }
        });
    });

// Set width for inputs in horizontal search bar -----------------------------------------------------------------------

    $("#redefine-search-form").load("assets/external/search-bar.html", function () {
        setInputsWidth();
        //autoComplete();
    });

//    if( $('#location').length ){
//        autoComplete();
//    }

// Keyboard Shortcuts --------------------------------------------------------------------------------------------------

    $(document).bind('keypress', 'F', function () {
        $('.redefine-search .expand-content').trigger('click');
        if (!$('.search-bar').hasClass('collapsed')) {
            setTimeout(function () {
                $('.search-bar input').first().focus();
            }, 200);
        }
        return false;
    });

    $(document).bind('keypress', 'M', function () {
        $('.header .toggle-navigation').trigger('click');
        return false;
    });

    $(document).bind('keypress', '+', function () {
        $('.header .submit-item').trigger('click');
        return false;
    });

    $(document).keydown(function (e) {
        switch (e.which) {
            case 37: // left
                $('.item-slider').trigger('prev.owl.carousel');
                break;
            case 39: // right
                $('.item-slider').trigger('next.owl.carousel');
                break;
            case 27: // ESC
                $('.modal-background').trigger('click');
                break;
        }
    });

//  Smooth Navigation Scrolling ----------------------------------------------------------------------------------------

    $('.navigation .nav a[href^="#"], a[href^="#"].roll').on('click', function (e) {
        e.preventDefault();
        var target = this.hash,
            $target = $(target);
        if ($(window).width() > 768) {
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top - $('.navigation').height()
            }, 2000)
        } else {
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, 2000)
        }
        return false;
    });

//  iCheck -------------------------------------------------------------------------------------------------------------

    if ($('.checkbox').length > 0) {
        $('input').iCheck();
    }

    if ($('.radio').length > 0) {
        $('input').iCheck();
    }

    $('body').addClass('page-fade-in');

    $('a').on('click', function (e) {
        var attr = $(this).attr('href');
        //alert( $(this).attr('href') );
        if (attr.indexOf('#') != 0) {
            e.preventDefault();
            var goTo = this.getAttribute("href");
            $('body').removeClass('page-fade-in');
            $('body').addClass('page-fade-out');
            setTimeout(function () {
                window.location = goTo;
            }, 200);
        }
        else if ($(this).attr('href') == '#') {
            e.preventDefault();
        }
    });

//  Dropzone -----------------------------------------------------------------------------------------------------------

    if ($('.dropzone').length > 0) {
        Dropzone.autoDiscover = false;
        $("#file-submit").dropzone({
            url: "upload",
            addRemoveLinks: true
        });

        $("#profile-picture").dropzone({
            url: "upload",
            addRemoveLinks: true
        });
    }

//  Timepicker ---------------------------------------------------------------------------------------------------------

    if ($('.oh-timepicker').length > 0) {
        $('.oh-timepicker').timepicker();
    }

    $('.item .quick-view').on('click', function (e) {
        e.preventDefault();
    });

//  Items scripts ------------------------------------------------------------------------------------------------------

    $('.item.admin-view .hide-item').on('click', function (e) {
        $(this).closest('.item').toggleClass('is-hidden');
    });

//  No UI Slider -------------------------------------------------------------------------------------------------------

    if ($('.ui-slider').length > 0) {
        $('.ui-slider').each(function () {
            var step;
            if ($(this).attr('data-step')) {
                step = parseInt($(this).attr('data-step'));
            }
            else {
                step = 10;
            }
            var sliderElement = $(this).attr('id');
            var element = $('#' + sliderElement);
            var valueMin = parseInt($(this).attr('data-value-min'));
            var valueMax = parseInt($(this).attr('data-value-max'));
            $(this).noUiSlider({
                start: [valueMin, valueMax],
                connect: true,
                range: {
                    'min': valueMin,
                    'max': valueMax
                },
                step: step
            });
            if ($(this).attr('data-value-type') == 'price') {
                if ($(this).attr('data-currency-placement') == 'before') {
                    $(this).Link('lower').to($(this).children('.values').children('.value-min'), null, wNumb({
                        prefix: $(this).attr('data-currency'),
                        decimals: 0,
                        thousand: '.'
                    }));
                    $(this).Link('upper').to($(this).children('.values').children('.value-max'), null, wNumb({
                        prefix: $(this).attr('data-currency'),
                        decimals: 0,
                        thousand: '.'
                    }));
                }
                else if ($(this).attr('data-currency-placement') == 'after') {
                    $(this).Link('lower').to($(this).children('.values').children('.value-min'), null, wNumb({
                        postfix: $(this).attr('data-currency'),
                        decimals: 0,
                        thousand: ' '
                    }));
                    $(this).Link('upper').to($(this).children('.values').children('.value-max'), null, wNumb({
                        postfix: $(this).attr('data-currency'),
                        decimals: 0,
                        thousand: ' '
                    }));
                }
            }
            else {
                $(this).Link('lower').to($(this).children('.values').children('.value-min'), null, wNumb({decimals: 0}));
                $(this).Link('upper').to($(this).children('.values').children('.value-max'), null, wNumb({decimals: 0}));
            }
        });
    }

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// On Load
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(window).load(function () {
    var $equalHeight = $('.equal-height');
    for (var i = 0; i < $equalHeight.length; i++) {
        equalHeight($equalHeight);
    }
});

$(window).resize(function () {
    adaptBackgroundHeight();
    var $equalHeight = $('.equal-height');
    for (var i = 0; i < $equalHeight.length; i++) {
        equalHeight($equalHeight);
    }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setInputsWidth() {
    var $inputRow = $('.search-bar.horizontal .input-row');
    for (var i = 0; i < $inputRow.length; i++) {
        if ($inputRow.find($('button[type="submit"]')).length) {
            $inputRow.find('.form-group:last').css('width', 'initial');
        }
    }

    var searchBar = $('.search-bar.horizontal .form-group');
    for (var a = 0; a < searchBar.length; a++) {
        if (searchBar.length <= ( 1 + 1 )) {
            $('.main-search').addClass('inputs-1');
        }
        else if (searchBar.length <= ( 2 + 1 )) {
            $('.main-search').addClass('inputs-2');
        }
        else if (searchBar.length <= ( 3 + 1 )) {
            $('.main-search').addClass('inputs-3');
        }
        else if (searchBar.length <= ( 4 + 1 )) {
            $('.main-search').addClass('inputs-4');
        }
        else if (searchBar.length <= ( 5 + 1 )) {
            $('.main-search').addClass('inputs-5');
        }
        else {
            $('.main-search').addClass('inputs-4');
        }
        if ($('.search-bar.horizontal .form-group label').length > 0) {
            $('.search-bar.horizontal .form-group:last-child button').css('margin-top', 25)
        }
    }
}

// Autocomplete address ------------------------------------------------------------------------------------------------

function autoComplete() {
    if (!$("script[src='assets/js/leaflet.js']").length) {
        var input = document.getElementById('location');
        var autocomplete = new google.maps.places.Autocomplete(input, {
            types: ["geocode"]
        });
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }

            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }
        });
    }
}

// Rating --------------------------------------------------------------------------------------------------------------

function rating(element) {
    var ratingElement =
            '<span class="stars">' +
            '<i class="fa fa-star s1" data-score="1"></i>' +
            '<i class="fa fa-star s2" data-score="2"></i>' +
            '<i class="fa fa-star s3" data-score="3"></i>' +
            '<i class="fa fa-star s4" data-score="4"></i>' +
            '<i class="fa fa-star s5" data-score="5"></i>' +
            '</span>'
        ;
    if (!element) {
        element = '';
    }
    $.each($(element + ' .rating'), function (i) {
        $(this).append(ratingElement);
        if ($(this).hasClass('active')) {
            $(this).append('<input readonly hidden="" name="score_' + $(this).attr('data-name') + '" id="score_' + $(this).attr('data-name') + '">');
        }
        var rating = $(this).attr('data-rating');
        for (var e = 0; e < rating; e++) {
            var rate = e + 1;
            $(this).children('.stars').children('.s' + rate).addClass('active');
        }
    });

    var ratingActive = $('.rating.active i');
    ratingActive.on('hover', function () {
            for (var i = 0; i < $(this).attr('data-score'); i++) {
                var a = i + 1;
                $(this).parent().children('.s' + a).addClass('hover');
            }
        },
        function () {
            for (var i = 0; i < $(this).attr('data-score'); i++) {
                var a = i + 1;
                $(this).parent().children('.s' + a).removeClass('hover');
            }
        });
    ratingActive.on('click', function () {
        $(this).parent().parent().children('input').val($(this).attr('data-score'));
        $(this).parent().children('.fa').removeClass('active');
        for (var i = 0; i < $(this).attr('data-score'); i++) {
            var a = i + 1;
            $(this).parent().children('.s' + a).addClass('active');
        }
        return false;
    });
}

// Owl Carousel in Modal Window ----------------------------------------------------------------------------------------

function drawOwlCarousel(_rtl) {
    $.getScript("assets/js/owl.carousel.min.js", function (data, textStatus, jqxhr) {
        $(".image .gallery").owlCarousel({
            rtl: _rtl,
            items: 1,
            nav: true,
            navText: ["", ""],
            responsiveBaseElement: ".image"
        });
    });
}

function lazyLoad(selector) {
    selector.load(function () {
        $(this).parent().removeClass('loading');
    });
}

//  Equal heights ------------------------------------------------------------------------------------------------------

function equalHeight(container) {
    var currentTallest = 0,
        currentRowStart = 0,
        rowDivs = new Array(),
        $el,
        topPosition = 0;

    $(container).find('.item, .price-box').each(function () {
        $el = $(this);
        $($el).height('auto');
        topPostion = $el.position().top;
        if (currentRowStart != topPostion) {
            for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                rowDivs[currentDiv].height(currentTallest);
            }
            rowDivs.length = 0; // empty the array
            currentRowStart = topPostion;
            currentTallest = $el.height();
            rowDivs.push($el);
        } else {
            rowDivs.push($el);
            currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
        }
        for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
            rowDivs[currentDiv].height(currentTallest);
        }
    });
}

// Initialize Owl carousel ---------------------------------------------------------------------------------------------

function initializeOwl(_rtl) {
    $.getScript("assets/js/owl.carousel.min.js", function (data, textStatus, jqxhr) {
        if ($('.owl-carousel').length > 0) {
            if ($('.carousel-full-width').length > 0) {
                setCarouselWidth();
            }
            $(".carousel.wide").owlCarousel({
                rtl: _rtl,
                items: 1,
                responsiveBaseWidth: ".slide",
                nav: true,
                navText: ["", ""]
            });
            $(".item-slider").owlCarousel({
                rtl: _rtl,
                items: 1,
                autoHeight: true,
                responsiveBaseWidth: ".slide",
                nav: false,
                callbacks: true,
                URLhashListener: true,
                navText: ["", ""]
            });
            $(".list-slider").owlCarousel({
                rtl: _rtl,
                items: 1,
                responsiveBaseWidth: ".slide",
                nav: true,
                navText: ["", ""]
            });
            $(".testimonials").owlCarousel({
                rtl: _rtl,
                items: 1,
                responsiveBaseWidth: "blockquote",
                nav: true,
                navText: ["", ""]
            });

            $('.item-gallery .thumbnails a').on('click', function () {
                $('.item-gallery .thumbnails a').each(function () {
                    $(this).removeClass('active');
                });
                $(this).addClass('active');
            });
            $('.item-slider').on('translated.owl.carousel', function (event) {
                var thumbnailNumber = $('.item-slider .owl-item.active img').attr('data-hash');
                $('.item-gallery .thumbnails #thumbnail-' + thumbnailNumber).trigger('click');
            });
            return false;
        }
    });
}

// Specific data for each item -----------------------------------------------------------------------------------------

function drawItemSpecific(category, json, a) {
    var itemSpecific = '';
    if (category) {
        if (category == 'real_estate') {
            if (json.data[a].item_specific) {
                if (json.data[a].item_specific.bedrooms) {
                    itemSpecific += '<span title="Bedrooms"><img src="assets/img/bedrooms.png">' + json.data[a].item_specific.bedrooms + '</span>';
                }
                if (json.data[a].item_specific.bathrooms) {
                    itemSpecific += '<span title="Bathrooms"><img src="assets/img/bathrooms.png">' + json.data[a].item_specific.bathrooms + '</span>';
                }
                if (json.data[a].item_specific.area) {
                    itemSpecific += '<span title="Area"><img src="assets/img/area.png">' + json.data[a].item_specific.area + '<sup>2</sup></span>';
                }
                if (json.data[a].item_specific.garages) {
                    itemSpecific += '<span title="Garages"><img src="assets/img/garages.png">' + json.data[a].item_specific.garages + '</span>';
                }
                return itemSpecific;
            }
        }
        else if (category == 'bar_restaurant') {
            if (json.data[a].item_specific) {
                if (json.data[a].item_specific.menu) {
                    itemSpecific += '<span>菜品单价: ' + json.data[a].item_specific.menu + ' 起</span>';
                }
                return itemSpecific;
            }
            return itemSpecific;
        }
    }
    else {
        return '';
    }
    return '';
}

// Quick View ----------------------------------------------------------------------------------------------------------

function quickView(id) {
    $.ajax({
        type: 'POST',
        url: 'assets/external/modal.html',
        data: id,
        success: function (data) {
            // Create HTML element with loaded data
            $('body').append(data);
        }
    });
}

// Adapt background height to block element ----------------------------------------------------------------------------

function adaptBackgroundHeight() {
    $('.background').each(function () {
        if ($(this).children('img').height() < $(this).height()) {
            //$(this).children('img').css('right', ( $(this).children('img').width()/2 -  $(window).width())/2 );
            $(this).children('img').css('width', 'auto');
            $(this).children('img').css('height', '100%');
        }
    });
}

// Update detail page based on JSON ------------------------------------------------------------------------------------

function updateCurrentPageContent(data) {
    $('#itemCategory').html(data.category);
    $('#title').html(data.title);
    $('#locationAll').html(data.location);
    var location1 = data.location.split(' ')[0];
    var location2 = data.location.split(' ')[1];
    var location3 = data.location.split(' ')[2];
    location1 != undefined ? $('#location1').html(location1) : {};
    location2 != undefined ? $('#location2').html(location2) : {};
    location3 != undefined ? $('#location3').html(location3) : {};
    data.mobile != undefined ? $('#mobile').html(data.mobile) : {};
    data.phone != undefined ? $('#phone').html(data.phone) : {};
    data.website != undefined ? $('#website').html(data.website) : {};
    data.description != undefined ? $('#description').html(data.description) : {};
    for (var i in data.gallery) {
        $('#imageSlide').append('<div class="slide"><img src="' + data.gallery[i] + '" data-hash="' + i + '" alt=""></div>')
        $('#imageThumb').append('<a href="#' + i + '" id="thumbnail-' + i + '" class="active"><img src="' + data.gallery[i] + '" alt=""></a>')
    }
    var dishes = data.item_specific.menu != undefined ? data.item_specific.menu.split(',') : "";
    var dishDetail = data.item_specific.dishDetail != undefined ? data.item_specific.dishDetail.split(',') : "";
    var dishPrice = data.item_specific.dishPrice != undefined ? data.item_specific.dishPrice.split(',') : "";
    if (dishes != "" && dishPrice != "") {
        var j = 0;
        var m = 1;
        for (var i in dishes) {
            if (j % 3 == 0) {
                $('#mainDishes').append('<div class="slide" id="dish-' + m + '"> ' +
                    '<header> ' +
                        //'<h3><i class="fa fa-calendar"></i>精品菜系</h3> ' +
                    '</header> ' +
                    '</div>');
                m += 1;
            }
            j++;
            $('#dish-' + (m - 1)).append(
                '<div class="list-item">\
                    <div class="left">\
                        <h4>' + dishes[i] + '</h4>\
                    </figure>\
                </div>\
                <div class="right">' + dishPrice[i] + '</div>\
            </div>')
            ;
        }
    }
    var features = data.item_specific.features != undefined ? data.item_specific.features.split(',') : "";
    if (features != "") {
        for (var i in features) {
            $('#features').append('<li>' + features[i] + '</li>');
        }
    }
    var openhours = data.item_specific.openhours != undefined ? data.item_specific.openhours.split(',') : "";
    var oht = $('#openHoursTable');
    oht.html('');
    if (openhours != "") {
        for (var i in openhours) {
            switch (i) {
                case "0":
                {
                    oht.append('<dt>周一</dt><dd id="oh' + i + '">' + openhours[i] + '</dd>');
                }
                    break;
                case "1":
                {
                    oht.append('<dt>周二</dt><dd id="oh' + i + '">' + openhours[i] + '</dd>');
                }
                    break;
                case "2":
                {
                    oht.append('<dt>周三</dt><dd id="oh' + i + '">' + openhours[i] + '</dd>');
                }
                    break;
                case "3":
                {
                    oht.append('<dt>周四</dt><dd id="oh' + i + '">' + openhours[i] + '</dd>');
                }
                    break;
                case "4":
                {
                    oht.append('<dt>周五</dt><dd id="oh' + i + '">' + openhours[i] + '</dd>');
                }
                    break;
                case "5":
                {
                    oht.append('<dt>周六</dt><dd id="oh' + i + '">' + openhours[i] + '</dd>');
                }
                    break;
                case "6":
                {
                    oht.append('<dt>周日</dt><dd id="oh' + i + '">' + openhours[i] + '</dd>');
                }
                    break;
            }
        }
    }
}

function updateCurrentPageContentOnline(data) {
    $('#itemCategory').html(data.category);
    $('#title').html(data.title);
    data.website != undefined ? $('#website').html(data.website) : {};
    data.description != undefined ? $('#description').html(data.description) : {};
    for (var i in data.gallery) {
        $('#imageSlide').append('<div class="slide"><img src="' + data.gallery[i] + '" data-hash="' + i + '" alt=""></div>')
        $('#imageThumb').append('<a href="#' + i + '" id="thumbnail-' + i + '" class="active"><img src="' + data.gallery[i] + '" alt=""></a>')
    }
    var dishes = data.item_specific.menu != undefined ? data.item_specific.menu.split(',') : "";
    var dishDetail = data.item_specific.dishDetail != undefined ? data.item_specific.dishDetail.split(',') : "";
    var dishPrice = data.item_specific.dishPrice != undefined ? data.item_specific.dishPrice.split(',') : "";
    if (dishes != "" && dishPrice != "") {
        var j = 0;
        var m = 1;
        for (var i in dishes) {
            if (j % 3 == 0) {
                $('#mainDishes').append('<div class="slide" id="dish-' + m + '"> ' +
                    '<header> ' +
                        //'<h3><i class="fa fa-calendar"></i>精品菜系</h3> ' +
                    '</header> ' +
                    '</div>');
                m += 1;
            }
            j++;
            $('#dish-' + (m - 1)).append(
                '<div class="list-item">\
                    <div class="left">\
                        <h4>' + dishes[i] + '</h4>\
                    </figure>\
                </div>\
                <div class="right">' + dishPrice[i] + '</div>\
            </div>')
            ;
        }
    }
    var features = data.item_specific.features != undefined ? data.item_specific.features.split(',') : "";
    if (features != "") {
        for (var i in features) {
            $('#features').append('<li>' + features[i] + '</li>');
        }
    }
    var openhours = data.item_specific.openhours != undefined ? data.item_specific.openhours.split(',') : "";
    var oht = $('#openHoursTable');
    oht.html('');
}


function prefilHomePageOld(json) {
    var target = $('#recommendedItems');
    target.html('');
    for (var i in json.data) {
        target.append('<div class="slide">\
            <div class="inner">\
            <div class="image">\
            <img src="' + json.data[i].gallery[0] + '" alt="" id="test1">\
            </div>\
            <div class="wrapper">\
            <a href="' + json.data[i].url + '"><h3>' + json.data[i].title + '</h3></a>\
        <figure>\
        <i class="fa fa-map-marker"></i>\
            <span>' + json.data[i].location + '</span>\
        </figure>\
        <div class="info">\
            <div class="rating" data-rating="' + json.data[i].rating + '">\
            <aside class="reviews">' + json.data[i].price + '</aside>\
        </div>\
        <div class="type">\
            <i><img src="assets/icons/restaurants-bars/restaurants/restaurant.png"\
        alt=""></i>\
            <span>' + json.data[i].category + '</span>\
            </div>\
            </div>\
            <p>' + _substring(json.data[i].description, 510) + '</p>\
        <a href="' + json.data[i].url + '" class="read-more icon">了解更多</a>\
            </div>\
            </div>\
            </div>');
    }
}
function prefilHomePage(json) {
    var target = $('#recommendedItems');
    target.html('');
    for (var i in json.data) {
        target.append('<div class="slide">\
            <div class="inner">\
            <div class="image">\
            <img src="' + json.data[i].gallery[0] + '" alt="" id="test1">\
            </div>\
            <div class="wrapper">\
            <a href="' + json.data[i].url + '"><h3>' + json.data[i].title + '</h3></a>\
        <figure>\
        <div class="info">\
        <div class="type">\
            <i><img src="assets/icons/restaurants-bars/restaurants/restaurant.png"\
        alt=""></i>\
            <span>' + json.data[i].category + '</span>\
            </div>\
            </div>\
            <p>' + _substring(json.data[i].description, 510) + '</p>\
        <a href="' + json.data[i].url + '" class="read-more icon">了解更多</a>\
            </div>\
            </div>\
            </div>');
    }
}

function _substring(str, len) {
    var vlen = 0, i = 0, extDot = "";
    for (; i < str.length; i++) {
        if (vlen >= len) {
            extDot = "...";
            break;
        } else {
            if (str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126) {
                vlen += 2;
            } else {
                vlen++;
            }
        }
    }
    return str.substring(0, i) + extDot;
}