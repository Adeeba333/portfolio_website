(function () {
    var root = document.documentElement;
    var themeBtn = document.getElementById('theme');
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    root.classList.add('js');

    function applyTheme(theme) {
        var isDark = theme === 'dark';
        root.setAttribute('data-theme', theme);
        themeBtn.setAttribute(
            'aria-label',
            'Switch to ' + (isDark ? 'light' : 'dark') + ' theme'
        );
    }

    var savedTheme = null;
    try {
        savedTheme = localStorage.getItem('theme');
    } catch (e) {}

    var prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

    themeBtn.addEventListener('click', function () {
        var current = root.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try {
        localStorage.setItem('theme', next);
        } catch (e) {}
    });

    var menuBtn = document.getElementById('menu');
    var links = document.getElementById('links');

    function setMenu(open) {
        links.classList.toggle('open', open);
        menuBtn.setAttribute('aria-expanded', open);
    }

    menuBtn.addEventListener('click', function () {
        setMenu(!links.classList.contains('open'));
    });

    links.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') setMenu(false);
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.menu-wrap')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setMenu(false);
    });

    var roleEl = document.getElementById('role');
    var roles = [
        'web applications',
        'responsive interfaces',
    ];

    if (!reduce) {
        var roleIndex = 0;
        var charCount = 0;
        var deleting = false;

        (function tick() {
        var word = roles[roleIndex];
        roleEl.textContent = word.slice(0, charCount);

        if (!deleting && charCount === word.length) {
            deleting = true;
            return setTimeout(tick, 1600);
        }
        if (deleting && charCount === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }

        charCount += deleting ? -1 : 1;
        setTimeout(tick, deleting ? 40 : 80);
        })();
    }

    var projects = [
        {
        title: 'TaskFlow',
        text:
            'A one-page landing site for a task app, with hero, features, ' +
            'reviews, pricing and a scroll animation.',
        tags: ['HTML', 'CSS', 'JavaScript'],
        category: 'web',
        github: 'https://github.com/Adeeba333/Elevvo_Frontend_Development_task3',
        },
        {
        title: 'toBATO.to',
        text: 'A dashboard with a collapsible sidebar and a themed layout.',
        tags: ['HTML', 'CSS', 'JavaScript'],
        category: 'web',
        github: 'https://github.com/Adeeba333/Elevvo_Frontend_Development_task1',
        },
        {
        title: 'DearDiary',
        text:
            'Personal blog with a dark/light theme, a responsive layout ' +
            'and a scroll animation.',
        tags: ['JavaScript'],
        category: 'web',
        github: 'https://github.com/Adeeba333/Elevvo_Frontend_Development_task4',
        },
        {
        title: 'TechTalk',
        text: 'A responsive tech product landing page featuring product displays, search, ' +
            'category filters, customer reviews, pricing plans, and theme toggle functionality.',
        tags: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
        category: 'web',
        github: 'https://github.com/Adeeba333/Elevvo_Frontend_Development_task5',
        },
        {
        title: 'Rice MultiNet',
        text:
            'A deep-learning model that identifies rice leaf diseases, ' +
            'published at IEEE in 2026.',
        tags: ['Python', 'Deep learning'],
        category: 'ai',
        live: '#research',
        liveText: 'Paper'
        }
    ];

    var cardBox = document.getElementById('cards');

    projects.forEach(function (p) {
        var card = document.createElement('article');
        card.className = 'card';
        card.dataset.c = p.category;

        var title = document.createElement('h3');
        title.textContent = p.title;

        var text = document.createElement('p');
        text.textContent = p.text;

        var tagList = document.createElement('ul');
        p.tags.forEach(function (tag) {
        var li = document.createElement('li');
        li.textContent = tag;
        tagList.appendChild(li);
        });

        var linkRow = document.createElement('div');
        linkRow.className = 'links';

        var items = [];
        if (p.github) items.push(['GitHub', p.github]);
        if (p.live) items.push([p.liveText || 'Live demo', p.live]);

        items.forEach(function (item) {
            var a = document.createElement('a');
            a.textContent = item[0];
            a.href = item[1];
            linkRow.appendChild(a);
        });

        card.append(title, text, tagList, linkRow);
        cardBox.appendChild(card);
    });

    var chips = document.querySelectorAll('.chip');

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            chips.forEach(function (other) {
                other.setAttribute('aria-pressed', other === chip);
            });

            var filter = chip.dataset.f;
            cardBox.querySelectorAll('.card').forEach(function (card) {
                card.hidden = !(filter === 'all' || card.dataset.c === filter);
            });
        });
    });
    var blocks = document.querySelectorAll('section:not(#home) .wrap');
    blocks.forEach(function (block) {
        block.classList.add('reveal');
    });

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                revealObserver.unobserve(entry.target);
            }
            });
        },
        { threshold: 0.12 }
        );
        blocks.forEach(function (block) {
        revealObserver.observe(block);
        });

        var navLinks = {};
        document.querySelectorAll('#links a').forEach(function (a) {
        navLinks[a.getAttribute('href').slice(1)] = a;
        });

        var sectionObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            Object.keys(navLinks).forEach(function (id) {
                navLinks[id].classList.toggle('active', id === entry.target.id);
            });
            });
        },
        { rootMargin: '-45% 0px -50% 0px' }
        );
        document.querySelectorAll('main section').forEach(function (section) {
        sectionObserver.observe(section);
        });
    } else {
        blocks.forEach(function (block) {
        block.classList.add('in');
        });
    }

    var topBtn = document.getElementById('toTop');

    addEventListener(
        'scroll',
        function () {
        topBtn.classList.toggle('show', scrollY > 600);
        },
        { passive: true }
    );

    topBtn.addEventListener('click', function () {
        scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });

    var form = document.getElementById('form');
    var status = document.getElementById('status');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var name = form.elements.name.value.trim();
        var email = form.elements.email.value.trim();
        var message = form.elements.msg.value.trim();

        var emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

        if (!name || !emailOk || message.length < 10) {
        status.textContent =
            'Please enter your name, a valid email and a message ' +
            'of at least 10 characters.';
        return;
        }

        var to = document
        .querySelector('.big')
        .getAttribute('href')
        .replace('mailto:', '');

        var subject = 'Portfolio message from ' + name;
        var body = message + '\n\n' + name + ' (' + email + ')';

        location.href =
        'mailto:' + to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

        status.textContent = 'Opening your email app\u2026';
    });
})(); 
