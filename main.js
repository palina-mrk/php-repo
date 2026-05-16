(function () {
    'use strict';

    var months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
      days = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
      daysMin = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
    function postDate(daysName, daysMinName, monthsName, monthsMinName, seasonsName) {
      var _counterLength = 60;
      for (var counter = 0; counter < _counterLength; counter++) {
        innerDate(counter, 'date-');
        innerDate(counter, 'date');
      }
      function innerDate(counter, dateType) {
        var newCounter;
        dateType === 'date-' ? newCounter = -counter : newCounter = counter;
        var _msInDay = 86400000,
          _localDate = new Date(Date.now() + newCounter * _msInDay),
          _day = _localDate.getDate(),
          _month = _localDate.getMonth() + 1,
          _year = _localDate.getFullYear();
        var dayDefault = addZero(_day),
          monthDefault = addZero(_month),
          defaultDate = dayDefault + '.' + monthDefault + '.' + _year;
        var dateClass = dateType + counter,
          nodeList = document.querySelectorAll('.' + dateClass);
        for (var i = 0; i < nodeList.length; i++) {
          var dateFormat = nodeList[i].dataset.format;
          dateFormat !== undefined && dateFormat !== '' ? nodeList[i].innerHTML = String(changeFormat(dayDefault, _month, _year, dateFormat, newCounter)) : nodeList[i].innerHTML = defaultDate;
        }
      }
      function changeFormat(_day, _month, _year, format, counter) {
        var innerFormat = format;
        var testFormat = ["dd", "mm", "yyyy", "monthFull", "monthOnly", "year"],
          dateFormat = {
            dd: _day,
            mm: addZero(_month),
            yyyy: _year,
            monthFull: getMonthName(_month, monthsName, false),
            monthOnly: getMonthName(_month, monthsName, false, counter),
            year: getYearWithCounter(_year, counter)
          };
        for (var i = 0; i < testFormat.length; i++) {
          var string = testFormat[i];
          var regExp = new RegExp(string);
          innerFormat = innerFormat.replace(regExp, dateFormat[string]);
        }
        return innerFormat.split(' ').join(' ');
      }
      function getMonthName(_month, monthsName, bigFirstLetter, counter) {
        var monthCounter = !!counter ? counter : 0;
        var month;
        _month + monthCounter > 12 ? month = monthCounter - (12 - _month) : month = _month + monthCounter;
        _month + monthCounter <= 0 ? month = 12 + monthCounter + 1 : month = _month + monthCounter;
        return changeFirstLetter(bigFirstLetter, monthsName[month - 1]);
      }
      function getYearWithCounter(year, counter) {
        return year + counter;
      }
      function addZero(numb) {
        return numb < 10 ? '0' + numb : numb;
      }
      function changeFirstLetter(isBig, str) {
        return isBig && str && str.length > 0 ? str[0].toUpperCase() + str.slice(1) : str;
      }
    }
    if (document.body.classList.contains('ev-date')) {
      document.addEventListener("DOMContentLoaded", function () {
        postDate(days, daysMin, months);
      });
    }

    // еверад 4.01, с фиксом через cdn_path, для проверки на сервере

    //.ever-popup-btn - класс для для открытия попапа

    //проверка кода
    //.check__field - класс для поля проверки кода
    //.check__btn - класс для кнопки провеки кода
    //.check__result - класс для контейнера с результатом проверки кода

    //таймер
    //для вывода счетчика таймера используется 3 контенера (часы, минуты, секунды)
    //.hours класс для вывода часов
    //.minutes класс для вывода минут
    //.seconds класс для вывода секунд

    if (!window.cdn_path) {
      (function () {
        function initiate() {
          var breakpoint = 1024,
            desktop = document.querySelector('#cloneThis'),
            mobile = document.querySelector('#cloneMobileThis');
          function createOverlay() {
            // создаем затемненный фон для попапа и вставляем его в разметку html
            var parent = document.createElement('div'),
              parentInner = document.createElement('div'),
              closeParent = document.createElement('div');
            parent.classList.add('ever-popup');
            parentInner.classList.add('ever-popup__inner');
            closeParent.classList.add('ever-popup__close');
            parent.appendChild(parentInner);
            parentInner.appendChild(closeParent);
            document.body.appendChild(parent);
          }
          function createModalBody() {
            // функция определяет содержимое для попапа, клонирует его содержимое, и поещает в контейнер ever-popup__body
            var parent = document.querySelector('.ever-popup__inner');
            var desktopClone;
            if (desktop) {
              desktopClone = desktop.cloneNode(true);
              desktopClone.classList.add('ever-popup__body');
              desktopClone.removeAttribute('id');
              parent.appendChild(desktopClone);
              document.querySelector('.ever-popup .ever-popup__inner').style.width = document.querySelector('#cloneThis').offsetWidth + 'px';
            }
            if (mobile) {
              var mobileClone = mobile.cloneNode(true);
              if (desktopClone) {
                desktopClone.classList.add('ever-desktop');
              }
              mobileClone.classList.add('ever-popup__body');
              mobileClone.classList.add('ever-mobile');
              mobileClone.removeAttribute('id');
              parent.appendChild(mobileClone);
              document.querySelector('.ever-popup .ever-popup__inner').style.width = document.querySelector('#cloneMobileThis').offsetWidth + 'px';
            }
          }
          function modalPosition(screenHeight) {
            //расчет ширины и вывод ее в html, функция вызывается при загрузке страницы, а так же при ресайзе
            var container = document.querySelector('.ever-popup  .ever-popup__inner');
            if (container) {
              var desktop = document.querySelector('#cloneThis'),
                mobile = document.querySelector('#cloneMobileThis');
              if (desktop) {
                checkPosition(desktop, container, screenHeight);
                if (window.innerWidth >= breakpoint) {
                  container.style.width = desktop.offsetWidth + 'px';
                }
                if (!mobile) {
                  container.style.width = desktop.offsetWidth + 'px';
                }
              }
              if (mobile) {
                checkPosition(mobile, container, screenHeight);
                if (window.innerWidth <= breakpoint) {
                  container.style.width = mobile.offsetWidth + 'px';
                }
              }
            }
          }
          function checkPosition(selector, container, screenHeight) {
            //позиционирование попапа по вертикали

            var cont = selector,
              contHeight = cont.offsetHeight;
            if (contHeight > screenHeight) {
              container.style.margin = '40px auto';
            } else {
              var top = (screenHeight - contHeight) / 2;
              container.style.margin = top + 'px auto 20px';
            }
          }
          function showPopup(event) {
            //функция для показа попапа
            if (event) {
              event.preventDefault();
              event.stopPropagation();
            }
            var popup = document.querySelector('.ever-popup');
            popup.classList.add('show');
            if (popup.scrollTop) {
              popup.scrollTop = 0;
            }
          }
          function hidePopup(event) {
            //функция для скрытия попапа
            if (event) {
              event.preventDefault();
              event.stopPropagation();
            }
            var popup = document.querySelector('.ever-popup');
            popup.classList.remove('show');
          }
          function notHide(e) {
            //функция для прерывания выполнения сценария по клику
            e.stopPropagation();
          }
          function checkCode(event) {
            // проверка кода подлинности
            event.preventDefault();
            var code = document.querySelector(".check__field").value,
              msg = document.querySelector(".check__result");
            if (code.length === 15) {
              msg.innerHTML = 'Данный код верен. Спасибо, что выбрали нашу продукцию!';
            } else if (code.length === 0) {
              msg.innerHTML = 'Введите, пожалуйста, код.';
            } else {
              msg.innerHTML = 'К сожалению, данный код не найден! Вероятнее всего, вы приобрели поддельный продукт.';
            }
          }
          function addPhoneBtn() {
            // добавление синей трубки для вызова попапа на десктопе (стили в style.min.css)
            var phoneBtnContainer = document.createElement('div');
            phoneBtnContainer.classList.add('phoneBtnContainer');
            phoneBtnContainer.innerHTML = '<div class="bluePhone"><div class=" phone-call cbh-phone cbh-green cbh-show ever-popup-btn cbh-static" id="clbh_phone_div"><div class="phoneJs"><div class="cbh-ph-circle"></div><div class="cbh-ph-circle-fill"></div><div class="cbh-ph-img-circle1"></div></div></div></div>';
            document.body.appendChild(phoneBtnContainer);
          }
          function init() {
            var desktopPopup = document.querySelector('#cloneThis'),
              mobilePopup = document.querySelector('#cloneMobileThis');
            var h = document.querySelector('.hours'),
              m = document.querySelector('.minutes'),
              s = document.querySelector('.seconds');
            if (h && m && s) {
              // если все значения (часы/минуты/секунды) сущесвтуют, тогда срабатывает таймер
              initializeTimer();
            }
            if (desktopPopup) {
              createOverlay();
              addPhoneBtn();
              document.querySelector('.phoneBtnContainer').addEventListener('click', showPopup);
            } else {
              createOverlay();
            }
            if (desktopPopup || mobilePopup) {
              //если у нас есть #cloneThis или #cloneMobileThis, тогда все функции ниже выполняются

              createModalBody();
              if (typeof window.x_strt === 'function') window.x_strt();
              modalPosition(window.innerHeight);
              document.querySelector('.ever-popup__close').addEventListener('click', hidePopup);
              document.querySelector('.ever-popup__inner').addEventListener('click', notHide);
              document.querySelector('.ever-popup').addEventListener('click', hidePopup);
              var modalBtn = document.querySelectorAll('.ever-popup-btn');
              for (var i = 0; i < modalBtn.length; i++) {
                modalBtn && modalBtn[i].addEventListener('click', showPopup);
              }
            }
            // рабоатет если у нас есть класс .check__btn
            var checkBtn = document.querySelector(".check__btn");
            checkBtn && checkBtn.addEventListener('click', checkCode);
          }

          // при документ реди вызывается функция init, описаная выше
          document.addEventListener('DOMContentLoaded', init);
          window.addEventListener('resize', function () {
            //при ресайзе пересчитываем позиционирование модального окна
            modalPosition(window.innerHeight);
          });
          function initializeTimer() {
            if (!localStorage.getItem("ever-timer")) {
              var time = {
                hours: 0,
                minutes: 27,
                seconds: 0
              };
              time = time.hours * 3600 + time.minutes * 60 + time.seconds;
              localStorage.setItem("time", time);
              localStorage.setItem("ever-timer", true);
            }
            timerSettings();
          }
          function timerSettings() {
            var time = localStorage.getItem('time'),
              different = document.querySelector(".timer-different"),
              hours = parseInt(time / 3600, 10),
              minutes = parseInt((time - hours * 3600) / 60, 10),
              seconds = parseInt(time % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : "" + minutes;
            seconds = seconds < 10 ? "0" + seconds : "" + seconds;
            hours = hours < 10 ? "0" + hours : "" + hours;
            var hoursHTML = document.getElementsByClassName("hours");
            var minutesHTML = document.getElementsByClassName("minutes");
            var secondsHTML = document.getElementsByClassName("seconds");
            if (--time < 0) {
              localStorage.removeItem("ever-timer");
              return;
            }
            if (different) {
              seconds = seconds.split("");
              minutes = minutes.split("");
              hours = hours.split("");
              diFilling(hoursHTML, hours);
              diFilling(minutesHTML, minutes);
              diFilling(secondsHTML, seconds);
            } else {
              filling(hoursHTML, hours);
              filling(minutesHTML, minutes);
              filling(secondsHTML, seconds);
            }
            localStorage.setItem("time", time);
            setTimeout(timerSettings, 1000);
          }
          function filling(obj, value) {
            for (var i = 0; i < obj.length; i++) {
              obj[i].innerHTML = value;
            }
          }
          function diFilling(obj, value) {
            for (var i = 0; i < obj.length; i++) {
              obj[i].innerHTML = value[i % 2];
            }
          }
        }
        initiate();
      })();
    }

    function faq() {
      var blocks = document.querySelectorAll('.faq, .efficacy');
      for (var b = 0; b < blocks.length; b++) {
        (function (block) {
          var isFaq = block.classList.contains('faq');
          var itemSelector = isFaq ? '.faq__item' : '.efficacy__item';
          var headerSelector = isFaq ? '.faq__header' : '.efficacy__header';
          var toggleSelector = isFaq ? '.faq__toggle' : '.efficacy__toggle';
          var contentSelector = isFaq ? '.faq__content' : '.efficacy__content';
          var collapsedHeight = '0px';

          function collapseAll() {
            var items = block.querySelectorAll(itemSelector);
            for (var i = 0; i < items.length; i++) {
              items[i].classList.remove('active');
              var content = items[i].querySelector(contentSelector);
              if (content) {
                content.style.maxHeight = collapsedHeight;
              }
            }
          }

          collapseAll();

          function toggleItem(item, content) {
            var isActive = item.classList.contains('active');
            if (isActive) {
              content.style.maxHeight = content.scrollHeight + 'px';
              requestAnimationFrame(function () {
                content.style.maxHeight = collapsedHeight;
              });
              item.classList.remove('active');
            } else {
              var items = block.querySelectorAll(itemSelector);
              for (var i = 0; i < items.length; i++) {
                var other = items[i];
                if (other !== item) {
                  other.classList.remove('active');
                  var otherContent = other.querySelector(contentSelector);
                  if (otherContent) {
                    otherContent.style.maxHeight = collapsedHeight;
                  }
                }
              }
              content.style.maxHeight = content.scrollHeight + 'px';
              item.classList.add('active');
            }
          }

          var headers = block.querySelectorAll(headerSelector);
          for (var h = 0; h < headers.length; h++) {
            headers[h].addEventListener('click', function () {
              var item = this.closest(itemSelector);
              if (!item) return;
              var content = item.querySelector(contentSelector);
              if (content) toggleItem(item, content);
            });
          }
          var toggles = block.querySelectorAll(toggleSelector);
          for (var t = 0; t < toggles.length; t++) {
            toggles[t].addEventListener('click', function (e) {
              e.stopPropagation();
              var item = this.closest(itemSelector);
              if (!item) return;
              var content = item.querySelector(contentSelector);
              if (content) toggleItem(item, content);
            });
          }
        })(blocks[b]);
      }
    }
    var focus = (function () {
      document.addEventListener('DOMContentLoaded', function () {
        var animatedContainers = new Set(); // Чтобы не анимировать повторно

        var animateSteps = function animateSteps(containerSelector, itemSelector) {
          var animatedClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'animated';
          var totalDelay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 400;
          var container = document.querySelector(containerSelector);
          if (!container || animatedContainers.has(container)) return;
          var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                var children = container.querySelectorAll(itemSelector);
                children.forEach(function (el, index) {
                  setTimeout(function () {
                    el.classList.add(animatedClass);
                  }, index * totalDelay);
                });
                setTimeout(function () {
                  container.classList.add('line-full');
                }, children.length * totalDelay + 100);
                animatedContainers.add(container); // Помечаем как анимированное
                observer.unobserve(container); // Отключаем после первого показа
              }
            });
          }, {
            threshold: 0.1
          });
          observer.observe(container);
        };
        var runAnimations = function runAnimations() {
          animateSteps('.focus__list', '.focus__item');
          animateSteps('.effect__list', '.effect__item');
          animateSteps('.expert__steps', '.expert__step');
        };
        runAnimations();

        // Повторная проверка при ресайзе (только если до этого не было анимации)
        window.addEventListener('resize', function () {
          runAnimations();
        });
      });
    });

    var scrollSmooth = (function () {

      var menu = document.querySelector('.menu');
      var menuHeight = 0;
      menu ? menuHeight = menu.clientHeight + menu.offsetTop : menuHeight = 0;
      var links = document.querySelectorAll('[href^="#"]');
      links.forEach(function (link) {
        return link.addEventListener('click', handleLink);
      });
      function handleLink(event) {
        event.preventDefault();
        var link = event.currentTarget;
        var hash = link.getAttribute('href');
        if (!hash || hash === '#') return;
        var elem = document.querySelector(hash);
        if (!elem) return;
        window.scrollTo({
          top: elem.getBoundingClientRect().top + window.scrollY - menuHeight,
          behavior: "smooth"
        });
      }
    });

    var header = (function () {
      var burger = document.querySelector('.header__burger');
      var mobMenu = document.querySelector('.header__mob');
      var mobMenuBg = document.querySelector('.header__bg');
      var mobClose = document.querySelector('.top__close');
      var mobContent = document.querySelector('.header__mob .header__content');
      var links = document.querySelectorAll('.item__link');
      burger.addEventListener('click', toggleMenu);
      mobClose.addEventListener('click', toggleMenu);
      mobMenuBg.addEventListener('click', toggleMenu);
      if (mobContent) {
        mobContent.addEventListener('transitionend', function (event) {
          if (event.target !== mobContent) return;
          mobMenu.classList.remove('header__mob--animate');
        });
      }
      for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', hideMenu);
      }
      function toggleMenu() {
        mobMenu.classList.add('header__mob--animate');
        mobMenu.classList.toggle('open');
        document.body.classList.toggle('hidden');
      }
      function hideMenu() {
        if (document.documentElement.clientWidth < 1024) {
          toggleMenu();
        }
      }
    });

    var promo = (function () {
      var addLoadedClass = function addLoadedClass() {
        if (window.innerWidth >= 1024 && !document.body.classList.contains('loaded')) {
          setTimeout(function () {
            document.body.classList.add('loaded');
          }, 1000);
        }
      };
      window.addEventListener('DOMContentLoaded', addLoadedClass);
      window.addEventListener('resize', addLoadedClass);

      function getZoomImageSrc(zoomer) {
        var img = zoomer.querySelector('img');
        if (!img) {
          return '';
        }
        if (img.complete && img.naturalWidth > 0) {
          return img.currentSrc || img.src;
        }
        return '';
      }
      function activateZoom(zoomerOrEvent) {
        var zoomer = zoomerOrEvent.currentTarget || zoomerOrEvent;
        if (zoomer.classList.contains('active')) {
          return;
        }
        var img = zoomer.querySelector('img');
        var src = getZoomImageSrc(zoomer);
        if (!src && img) {
          img.addEventListener(
            'load',
            function () {
              activateZoom(zoomer);
            },
            { once: true }
          );
          return;
        }
        if (!src) {
          return;
        }
        zoomer.classList.add('active');
        zoomer.style.backgroundImage = 'url("' + src + '")';
      }
      function zoom(e) {
        var zoomer = e.currentTarget;
        activateZoom(zoomer);
        if (!zoomer.classList.contains('active')) {
          return;
        }
        var offsetX = 0;
        var offsetY = 0;
        if (e.type === 'mousemove') {
          offsetX = e.offsetX;
          offsetY = e.offsetY;
        } else if (e.type === 'touchmove' && e.touches.length > 0) {
          var rect = zoomer.getBoundingClientRect();
          offsetX = e.touches[0].clientX - rect.left;
          offsetY = e.touches[0].clientY - rect.top;
        }
        var x = offsetX / zoomer.offsetWidth * 100;
        var y = offsetY / zoomer.offsetHeight * 100;
        zoomer.style.backgroundPosition = x + '% ' + y + '%';
      }
      function resetZoom(e) {
        var zoomer = e.currentTarget;
        zoomer.classList.remove('active');
        zoomer.style.backgroundPosition = '';
        zoomer.style.backgroundImage = '';
      }
      var zoomElements = [];
      function addZoomListeners() {
        removeZoomListeners();
        zoomElements = Array.from(document.querySelectorAll('[data-zoom]'));
        zoomElements.forEach(function (el) {
          el.addEventListener('mouseenter', activateZoom);
          el.addEventListener('mousemove', zoom);
          el.addEventListener('mouseleave', resetZoom);
        });
      }
      function removeZoomListeners() {
        zoomElements.forEach(function (el) {
          el.removeEventListener('mouseenter', activateZoom);
          el.removeEventListener('mousemove', zoom);
          el.removeEventListener('mouseleave', resetZoom);
          el.classList.remove('active');
          el.style.backgroundPosition = '';
          el.style.backgroundImage = '';
        });
        zoomElements = [];
      }
      function handleZoomActivation() {
        if (window.innerWidth >= 1220) {
          addZoomListeners();
        } else {
          removeZoomListeners();
        }
      }
      document.addEventListener('DOMContentLoaded', handleZoomActivation);
      window.addEventListener('resize', handleZoomActivation);
    });

    var reviews = (function () {
      new Swiper(".reviews__slider", {
        direction: "horizontal",
        slidesPerView: 1,
        spaceBetween: 0,
        autoHeight: true,
        loop: false,
        // важно отключить loop для корректной работы групп
        pagination: {
          el: '.reviews-slider__pagination',
          clickable: true
        },
        navigation: {
          nextEl: ".reviews-slider__button-next",
          prevEl: ".reviews-slider__button-prev"
        },
        breakpoints: {
          640: {
            spaceBetween: 13,
            loop: true
          },
          1024: {
            spaceBetween: 23,
            loop: true
          }
        }
      });
    });

    header();
    scrollSmooth();
    faq();
    function main() {
      reviews();
      focus();
      promo();
    }
    if (document.documentElement.clientWidth < 480) {
      window.addEventListener("scroll", function () {
        setTimeout(main, 1000);
      }, {
        once: true,
        passive: true
      });
    } else {
      main();
    }

}());
