/*
    1. circle 모션 interval 시간은 상관없으나 슬라이드 당 각도는 90도
    2. pagination 영역 over시 interval일시정지(circle 애니메이션도 그대로 중지) -> 영역에서 벗어나면 다시 진행
    3. paging click 시 interval 완전 중지, circle위치 90,180,270, 360 위치로 지정
    */

const sec2 = document.getElementsByClassName("sec2")[0];
const remote = document.getElementsByClassName("remote")[0];
const remoteBtn = Array.from(document.querySelectorAll(".remote li"));
const productContent = document.getElementsByClassName("content");
const contentBg = document.querySelectorAll(".product .bg");
const contentObjectImg = document.querySelectorAll(".object img");
const processRings = document.querySelectorAll(".ring");

let contentTimeline;
let previousIndex = 0;
let activeIndex = 0;

let ringTimeline = null;
const rotationAmount = 90;
let speed = 3;

function init() {
    gsap.set(processRings, {rotation: 0});
    gsap.set(contentBg, {transform: "translateY(100%)"});
    gsap.set(contentObjectImg, {transform: "translateY(100%)"});
    gsap.set(contentBg[0], {transform: "translateY(0)"});
    gsap.set(contentObjectImg[0], {transform: "translateY(0)"});
    productContent[0].classList.add("active");
}

init();

function rotateRing(ring) {
    if (ringTimeline) {
        ringTimeline.kill();
    }

    ringTimeline = gsap.timeline();
    ringTimeline.to(ring, {
        rotation: rotationAmount,
        duration: speed,
        ease: "none",
        onComplete: () => {
            console.log("onComplete");
            sec2Motion();
        }
    });
}

function sec2Motion() {
    remoteBtn.forEach(function (btn) {
        btn.classList.remove("active");
    });

    remoteBtn[activeIndex].classList.add("active");

    Array.from(productContent).forEach(function (content, i) {
        if (i !== activeIndex) {
            content.classList.remove("active");
            gsap.set(processRings[i], {rotation: 0});
            gsap.set(contentBg[i], {transform: "translateY(100%)"});
            gsap.set(contentObjectImg[i], {transform: "translateY(100%)"});
        } else {
            productContent[i].style.backgroundImage = "url(images/item" + (previousIndex + 1) + "_bg.jpg)";
            content.classList.add("active");
            rotateRing(processRings[i]);
        }
    });

    if (contentTimeline) {
        contentTimeline.kill();
    }

    contentTimeline = gsap.timeline();
    contentTimeline
        .to(contentBg[activeIndex], {
            transform: "translateY(0)",
            duration: 0.75,
            ease: "power2.out"
        })
        .to(contentObjectImg[activeIndex], {
            delay: 0.3,
            transform: "translateY(0)",
            duration: 0.75,
            ease: "power2.out"
        }, "<");

    // 다음 인덱스로 이동
    previousIndex = activeIndex;
    activeIndex = (activeIndex + 1) % remoteBtn.length; // 인덱스 루프
    // console.log("previousIndex", previousIndex);
    // console.log("activeIndex", activeIndex);
}

const secTl = gsap.timeline({
    scrollTrigger: {
        trigger: sec2,
        start: "top top",
        end: "bottom bottom",
        markers: false,
        onEnter: () => {
            sec2Motion();
        }
    }
});

remote.addEventListener("mouseenter", () => {
    if (ringTimeline) {
        ringTimeline.pause();
    }
});

remote.addEventListener("mouseleave", () => {
    if (ringTimeline) {
        ringTimeline.play();
    }
});

remoteBtn.forEach(function (btn, index) {
    btn.addEventListener("click", function () {
        activeIndex = index;
        sec2Motion(index);
        if (ringTimeline) {
            ringTimeline.kill();
        }
    });
});