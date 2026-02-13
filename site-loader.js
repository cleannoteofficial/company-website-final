// ================================================================
//  이 파일은 수정하지 마세요
// ================================================================
//
//  이 파일은 config.js 와 content.js 의 설정값을 읽어서
//  웹페이지에 자동으로 적용하는 로더입니다.
//
//  수정이 필요하면 config.js 또는 content.js 만 수정하세요.
//
// ================================================================


document.addEventListener('DOMContentLoaded', function () {
    try {
        if (typeof CONFIG !== 'undefined') {
            applyCompanyInfo();
            applyFooter();
            applyPricing();
        }
        if (typeof CONTENT !== 'undefined') {
            applyHeroContent();
            applyStats();
            applyAbout();
            applyWhyUsStats();
            applyReviews();
            applyServiceHero();
            applyServiceCards();
            applyProcessSteps();
        }
    } catch (e) {
        console.warn('[site-loader] 설정 적용 중 오류:', e);
    }
});


// ────────────────────────────────────────
//  회사 기본 정보 적용 (네비게이션)
// ────────────────────────────────────────

function applyCompanyInfo() {
    // 로고 회사명
    document.querySelectorAll('.logo').forEach(function (el) {
        var img = el.querySelector('img');
        if (img) {
            img.alt = CONFIG.companyName;
            el.innerHTML = '';
            el.appendChild(img);
            el.appendChild(document.createTextNode(' ' + CONFIG.companyName));
        }
    });

    // 포트폴리오 링크
    document.querySelectorAll('.nav-menu a').forEach(function (a) {
        if (a.getAttribute('href') && a.getAttribute('href').includes('soomgo.com')) {
            a.href = CONFIG.portfolioUrl;
        }
    });

    // 네비게이션 전화번호
    document.querySelectorAll('.nav-right .phone').forEach(function (el) {
        var svg = el.querySelector('svg');
        if (svg) {
            el.innerHTML = '';
            el.appendChild(svg);
            el.appendChild(document.createTextNode(CONFIG.phone));
        }
    });
}


// ────────────────────────────────────────
//  푸터 정보 적용
// ────────────────────────────────────────

function applyFooter() {
    // 푸터 로고 회사명
    document.querySelectorAll('.footer-logo a').forEach(function (el) {
        var img = el.querySelector('img');
        if (img) {
            img.alt = CONFIG.companyName;
            el.innerHTML = '';
            el.appendChild(img);
            el.appendChild(document.createTextNode(' ' + CONFIG.companyName));
        }
    });

    // 푸터 설명문
    document.querySelectorAll('.footer-desc').forEach(function (el) {
        el.innerHTML = CONFIG.footerDescription.replace(/\n/g, '<br>');
    });

    // 소셜 링크
    var socialMap = {
        'Talk': CONFIG.kakaotalkUrl,
        'Blog': CONFIG.naverBlogUrl,
        'Place': CONFIG.naverPlaceUrl,
        'Soomgo': CONFIG.soomgoUrl,
    };
    document.querySelectorAll('.footer-social a').forEach(function (a) {
        var label = a.getAttribute('aria-label');
        if (label && socialMap[label]) {
            a.href = socialMap[label];
        }
    });

    // 푸터 연락처 정보
    document.querySelectorAll('.footer-contact .contact-info li').forEach(function (li) {
        var svg = li.querySelector('svg');
        var text = li.textContent.trim();

        if (text.includes('@')) {
            // 이메일
            if (svg) { li.innerHTML = ''; li.appendChild(svg); }
            else { li.innerHTML = ''; }
            li.appendChild(document.createTextNode('\n                            ' + CONFIG.email + '\n                        '));
        } else if (/\d{3,4}[-.]?\d{3,4}/.test(text)) {
            // 전화번호
            if (svg) { li.innerHTML = ''; li.appendChild(svg); }
            else { li.innerHTML = ''; }
            li.appendChild(document.createTextNode('\n                            ' + CONFIG.phone + '\n                        '));
        } else if (!text.includes('@') && !/\d{4}/.test(text)) {
            // 주소 (숫자나 @가 없는 항목)
            if (svg) { li.innerHTML = ''; li.appendChild(svg); }
            else { li.innerHTML = ''; }
            li.appendChild(document.createTextNode('\n                            ' + CONFIG.address + '\n                        '));
        }
    });

    // 저작권 텍스트
    document.querySelectorAll('.footer-bottom p').forEach(function (p) {
        if (p.textContent.includes('©') || p.textContent.includes('&copy;')) {
            p.innerHTML = '&copy; ' + CONFIG.copyrightYear + ' ' + CONFIG.companyName + '. All rights reserved.';
        }
    });
}


// ────────────────────────────────────────
//  가격 정보 적용
// ────────────────────────────────────────

function applyPricing() {
    var pricing = CONFIG.pricing;

    // ── 메인 페이지: 서비스 카드 가격 ──
    var serviceCardMap = {
        '입주 청소':   pricing.ipju,
        '이사 청소':   pricing.moving,
        '거주 청소':   pricing.residence,
        '사업장 청소': pricing.office,
        '정기 청소':   pricing.regular,
        '특수 청소':   pricing.special,
    };

    document.querySelectorAll('.service-card').forEach(function (card) {
        var titleEl = card.querySelector('.service-title');
        var priceEl = card.querySelector('.service-price');
        if (titleEl && priceEl) {
            var title = titleEl.textContent.trim();
            var data = serviceCardMap[title];
            if (data) {
                if (data.basePrice > 0) {
                    priceEl.textContent = formatWon(data.basePrice) + '~';
                } else if (data.priceNote) {
                    priceEl.textContent = data.priceNote;
                }
            }
        }
    });

    // ── 견적 페이지: 서비스 옵션 ──
    var quoteServiceMap = {
        'ipju':     pricing.ipju,
        'moving':   pricing.moving,
        'residence': pricing.residence,
        'office':   pricing.office,
        'store':    pricing.store,
        'building': pricing.building,
    };

    document.querySelectorAll('.service-option').forEach(function (el) {
        var serviceId = el.getAttribute('data-service');
        if (serviceId && quoteServiceMap[serviceId]) {
            var data = quoteServiceMap[serviceId];
            el.setAttribute('data-base-price', data.basePrice);
            var descEl = el.querySelector('.option-desc');
            if (descEl && data.basePrice > 0) {
                descEl.textContent = formatWon(data.basePrice) + '~';
            }
        }
    });

    // ── 견적 페이지: 면적 배수 ──
    if (CONFIG.areaMultipliers) {
        document.querySelectorAll('.area-btn').forEach(function (btn) {
            var area = btn.getAttribute('data-area');
            if (area && CONFIG.areaMultipliers[area] !== undefined) {
                btn.setAttribute('data-multiplier', CONFIG.areaMultipliers[area]);
            }
        });
    }

    // ── 견적 페이지: 부가 서비스 가격 ──
    if (CONFIG.additionalServices) {
        var addSvcEls = document.querySelectorAll('.additional-services .checkbox-option[data-price]');
        CONFIG.additionalServices.forEach(function (svc, i) {
            if (addSvcEls[i]) {
                addSvcEls[i].setAttribute('data-price', svc.price);
                var priceTag = addSvcEls[i].querySelector('.price-tag');
                if (priceTag) {
                    priceTag.textContent = '+' + formatWon(svc.price);
                }
            }
        });
    }

    // ── 견적 페이지: 긴급 비용 ──
    if (CONFIG.urgentFee !== undefined) {
        var urgentLabel = document.querySelector('#urgent');
        if (urgentLabel) {
            var urgentParent = urgentLabel.closest('.checkbox-option') || urgentLabel.parentElement;
            var urgentPriceTag = urgentParent ? urgentParent.querySelector('.price-tag') : null;
            if (urgentPriceTag) {
                urgentPriceTag.textContent = '+' + formatWon(CONFIG.urgentFee);
            }
        }
    }

    // ── 견적 페이지: 오른쪽 가격표 ──
    var priceListItems = document.querySelectorAll('.price-list .price-item');
    var priceListOrder = ['ipju', 'moving', 'residence', 'office', 'store', 'building'];

    priceListItems.forEach(function (item, i) {
        var serviceId = priceListOrder[i];
        if (serviceId && pricing[serviceId]) {
            var valueEl = item.querySelector('.price-value');
            var perEl = item.querySelector('.price-per');
            if (valueEl && pricing[serviceId].basePrice > 0) {
                valueEl.textContent = pricing[serviceId].basePrice.toLocaleString('ko-KR') + '원~';
            }
            if (perEl) perEl.textContent = pricing[serviceId].priceNote;
        }
    });

    // ── 견적 페이지: 상담 전화 정보 ──
    var contactNumber = document.querySelector('.contact-info-box .contact-number');
    var contactTime = document.querySelector('.contact-info-box .contact-time');
    if (contactNumber) contactNumber.textContent = CONFIG.consultPhone;
    if (contactTime) contactTime.textContent = CONFIG.consultHours;

    // ── 서비스 페이지: 각 서비스 상세 가격 ──
    if (CONFIG.servicePagePrices) {
        Object.keys(CONFIG.servicePagePrices).forEach(function (sectionId) {
            var section = document.getElementById(sectionId);
            if (section) {
                var priceBox = section.querySelector('.price-box span') ||
                               section.closest('.service-detail-left') &&
                               section.querySelector('.price-box span');
                // 가격 박스가 section 내에 있는 경우
                if (!priceBox) {
                    var parent = section.closest ? section : section.parentElement;
                    var boxes = parent.querySelectorAll('.price-box span');
                    if (boxes.length > 0) {
                        priceBox = boxes[0];
                    }
                }
                if (priceBox) {
                    priceBox.textContent = CONFIG.servicePagePrices[sectionId];
                }
            }
        });
    }
}


// ────────────────────────────────────────
//  히어로 섹션 콘텐츠 적용
// ────────────────────────────────────────

function applyHeroContent() {
    if (!CONTENT.hero) return;

    var hero = CONTENT.hero;
    var heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // 배지
    var badge = heroSection.querySelector('.badge');
    if (badge && hero.badge) badge.textContent = hero.badge;

    // 타이틀
    var titleEl = heroSection.querySelector('.hero-title h1');
    if (titleEl && hero.title) {
        titleEl.innerHTML = hero.title + '<br><span class="highlight">' + hero.titleHighlight + '</span>';
    }

    // 설명
    var descEl = heroSection.querySelector('.desc p');
    if (descEl && hero.description) descEl.textContent = hero.description;

    // 특장점 목록
    if (hero.features) {
        var advList = heroSection.querySelector('.adv');
        if (advList) {
            advList.innerHTML = hero.features.map(function (f) {
                return '<li>' + f + '</li>';
            }).join('');
        }
    }
}


// ────────────────────────────────────────
//  통계 숫자 적용
// ────────────────────────────────────────

function applyStats() {
    if (!CONTENT.stats) return;

    var statItems = document.querySelectorAll('.hero .stat-item');
    CONTENT.stats.forEach(function (stat, i) {
        if (statItems[i]) {
            var h3 = statItems[i].querySelector('h3');
            var p = statItems[i].querySelector('p');
            if (h3) h3.textContent = stat.value;
            if (p) p.textContent = stat.label;
        }
    });
}


// ────────────────────────────────────────
//  회사 소개 섹션 적용
// ────────────────────────────────────────

function applyAbout() {
    if (!CONTENT.about) return;

    var aboutSection = document.querySelector('.about-section');
    if (!aboutSection) return;

    var badge = aboutSection.querySelector('.about-badge');
    if (badge && CONTENT.about.badge) badge.textContent = CONTENT.about.badge;

    var title = aboutSection.querySelector('.about-title');
    if (title && CONTENT.about.title) {
        title.innerHTML = CONTENT.about.title.replace(/\n/g, '<br>');
    }

    if (CONTENT.about.paragraphs) {
        var descDiv = aboutSection.querySelector('.about-description');
        if (descDiv) {
            descDiv.innerHTML = CONTENT.about.paragraphs.map(function (p) {
                return '<p>' + p + '</p>';
            }).join('');
        }
    }
}


// ────────────────────────────────────────
//  왜 클린노트인가 통계 적용
// ────────────────────────────────────────

function applyWhyUsStats() {
    if (!CONTENT.whyUsStats) return;

    var statBoxes = document.querySelectorAll('.why-us-stats .stat-box');
    CONTENT.whyUsStats.forEach(function (stat, i) {
        if (statBoxes[i]) {
            var h2 = statBoxes[i].querySelector('h2');
            var p = statBoxes[i].querySelector('p');
            if (h2) h2.textContent = stat.value;
            if (p) p.textContent = stat.label;
        }
    });
}


// ────────────────────────────────────────
//  고객 리뷰 적용
// ────────────────────────────────────────

function applyReviews() {
    if (!CONTENT.reviews || CONTENT.reviews.length === 0) return;

    var slider = document.querySelector('.reviews-slider');
    if (!slider) return;

    slider.innerHTML = '';

    // 새 리뷰 카드 생성
    CONTENT.reviews.forEach(function (review) {
        var card = document.createElement('div');
        card.className = 'review-card';

        // 별점 SVG 생성
        var starsHTML = '';
        for (var s = 0; s < review.rating; s++) {
            starsHTML += '<svg fill="#FFB800" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
        }
        // 빈 별
        for (var e = review.rating; e < 5; e++) {
            starsHTML += '<svg fill="#DDD" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
        }

        card.innerHTML =
            '<div class="review-header">' +
                '<div class="review-avatar">' + review.initial + '</div>' +
                '<div class="review-info">' +
                    '<div class="review-name">' + review.name + '</div>' +
                    '<div class="review-service">' + review.service + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="review-rating">' + starsHTML + '</div>' +
            '<p class="review-text">' + review.text + '</p>' +
            '<div class="review-date">' + review.date + '</div>';

        slider.appendChild(card);
    });
}


// ────────────────────────────────────────
//  서비스 페이지 히어로 적용
// ────────────────────────────────────────

function applyServiceHero() {
    if (!CONTENT.serviceHero) return;

    var hero = CONTENT.serviceHero;
    var section = document.querySelector('.service .service-content');
    if (!section) return;

    var badge = section.querySelector('.badge');
    if (badge && hero.badge) badge.textContent = hero.badge;

    var titleEl = section.querySelector('.service-title h1');
    if (titleEl) {
        titleEl.innerHTML = hero.title + '<br><span class="highlight">' + hero.titleHighlight + '</span>';
    }

    var descEl = section.querySelector('.service-desc p');
    if (descEl && hero.description) descEl.textContent = hero.description;
}


// ────────────────────────────────────────
//  서비스 페이지 카드 동적 생성
// ────────────────────────────────────────

function applyServiceCards() {
    if (!CONTENT.serviceCards || CONTENT.serviceCards.length === 0) return;

    var container = document.querySelector('.service-detail-container');
    if (!container) return;

    // 기존 카드 모두 제거
    container.innerHTML = '';

    // SVG 아이콘 템플릿
    var clockSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3dd5c1" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
    var teamSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3dd5c1" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
    var checkSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3dd5c1" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>';

    CONTENT.serviceCards.forEach(function (card) {
        // ── 왼쪽: 서비스 정보 ──
        var left = document.createElement('div');
        left.className = 'service-detail-left';
        left.id = card.id;

        left.innerHTML =
            '<div class="service-detail-header">' +
                '<div class="service-icon-large">' +
                    '<img src="' + card.icon + '" alt="' + card.title + '" width="40" height="40">' +
                '</div>' +
                '<div class="service-detail-header-content">' +
                    '<h2>' + card.title + '</h2>' +
                    '<p class="service-subtitle">' + card.subtitle + '</p>' +
                '</div>' +
            '</div>' +
            '<p class="service-detail-desc">' + card.description + '</p>' +
            '<div class="service-info-boxes">' +
                '<div class="info-box">' + clockSVG + '<span>' + card.time + '</span></div>' +
                '<div class="info-box">' + teamSVG + '<span>' + card.team + '</span></div>' +
                '<div class="info-box price-box"><span>' + card.price + '</span></div>' +
            '</div>' +
            '<a href="quote.html" class="service-booking-btn">상담 신청하기</a>';

        container.appendChild(left);

        // ── 오른쪽: 포함 사항 ──
        var right = document.createElement('div');
        right.className = 'service-detail-right';

        var includesHTML = card.includes.map(function (item) {
            return '<li>' + checkSVG + ' ' + item + '</li>';
        }).join('');

        right.innerHTML =
            '<div class="service-includes">' +
                '<h3>서비스 포함 사항</h3>' +
                '<ul class="includes-list">' + includesHTML + '</ul>' +
            '</div>';

        container.appendChild(right);
    });
}


// ────────────────────────────────────────
//  서비스 진행 과정 동적 생성
// ────────────────────────────────────────

function applyProcessSteps() {
    if (!CONTENT.processSteps || CONTENT.processSteps.length === 0) return;

    var stepsContainer = document.querySelector('.process-steps');
    if (!stepsContainer) return;

    // 아이콘 맵
    var iconMap = {
        'phone': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        'estimate': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 11H3V21H9V11Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 11H15V21H21V11Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 3H9L5 11H15L11 3H12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 3H16L12 11H22L18 3H19Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        'calendar': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="16" y1="2" x2="16" y2="6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        'thumbsup': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    };

    stepsContainer.innerHTML = '';

    CONTENT.processSteps.forEach(function (step, i) {
        var stepEl = document.createElement('div');
        stepEl.className = 'process-step';

        var isLast = (i === CONTENT.processSteps.length - 1);
        var connectorHTML = isLast ? '' : '<div class="step-connector"></div>';
        var svgIcon = iconMap[step.iconType] || iconMap['phone'];

        stepEl.innerHTML =
            '<div class="step-icon">' + svgIcon + '</div>' +
            connectorHTML +
            '<div class="step-number">' + step.number + '</div>' +
            '<h3 class="step-title">' + step.title + '</h3>' +
            '<p class="step-desc">' + step.description + '</p>';

        stepsContainer.appendChild(stepEl);
    });
}


// ────────────────────────────────────────
// 유틸리티 함수
// ────────────────────────────────────────

function formatWon(amount) {
    if (amount >= 10000) {
        var man = amount / 10000;
        if (man === Math.floor(man)) {
            return man + '만원';
        } else {
            return man + '만원';
        }
    }
    return amount.toLocaleString('ko-KR') + '원';
}