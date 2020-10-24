class GITHUB {
    constructor() {
        this.CLIENT_ID = `c83d75e18aa36abf7a1d`;
        this.CLIENT_SECRETE = `29bea6bf8ffead36da810e87b51bb5428deaf1ce`;
        this.baseURl = ` https://api.github.com/users/`;
    }

    async ajaxUser(userValue) {
        const userURL = `${this.baseURl}${userValue}?client_id='${this.CLIENT_ID}'&client_secret='${this.CLIENT_SECRETE}'`;
        const userData = await fetch(userURL);
        const user = await userData.json();


        const reposURL = `${this.baseURl}${userValue}/repos?client_id='${this.CLIENT_ID}'&client_secret='${this.CLIENT_SECRETE}'`;
        const reposData = await fetch(reposURL);
        const repos = await reposData.json();
        return {
            user,
            repos
        }
    }


};

class UI {
    constructor() {}

    showFeedback(text) {
        const feedback = document.querySelector('.feedback');
        feedback.innerHTML = `<p>${text}</p>`
        feedback.classList.add('showItem');

        setTimeout(() => {
            feedback.classList.remove('showItem');
        }, 2000);
    }

    getUser(data) {
        let info = data.user;

        const {
            avatar_url: image,
            html_url: link,
            login,
            name,
            public_repos: repos,
            followers,
            following,
            message
        } = info;
        if (message === 'Not Found') {
            this.showFeedback('No Such user');
        } else {
            this.displayUser(image, link, login, name, repos, followers, following);
        }
    }

    displayUser(image, link, login, name, repos, followers, following) {
        const githubUsers = document.getElementById('github-users');
        const div = document.createElement('div');

        div.classList.add('row', 'single-user', 'my-3')
        div.innerHTML = `
        <div class=" col-sm-6 col-md-4 user-photo my-2">
        <img src="${image}" class="img-fluid" alt="">
       </div>
       <div class="col-sm-6 col-md-4 user-info text-capitalize my-2">
        <h6>name : <span>${name}</span></h6>
        <h6>github : <a href="${link}" class="badge badge-primary" target='_blank'>link</a> </h6>
        <h6>public repos : <span class="badge badge-success">${repos}</span> </h6>
        <h6>followers : <span>${followers}</span></h6>
        <h6>following : <span>${following}</span></h6>
       </div>
       <div class=" col-sm-6 col-md-4 user-repos my-2">
        <button type="button" data-id='${login}' id="getRepos" class="btn reposBtn text-capitalize mt-3">
         get repos
        </button>
       </div> 
        `;

        githubUsers.appendChild(div);
    };

    displayRepos(userID, repos) {
        const reposBtn = document.querySelectorAll('[data-id]');
        reposBtn.forEach(btn => {
            if (btn.dataset.id === userID) {
                const parent = btn.parentNode;

                repos.forEach(repo => {
                    const p = document.createElement('p');
                    p.innerHTML = `<p><a href='${repo.html_url}' target='_blank'>${repo.name}</a></p>`;
                    parent.appendChild(p);
                });
            }
        })
    }
};

(() => {
    const github = new GITHUB();
    const ui = new UI();

    const searchForm = document.getElementById('searchForm');
    const searchUser = document.getElementById('searchUser');
    const userList = document.getElementById('github-users');

    searchForm.addEventListener('submit', e => {
        e.preventDefault();

        let value = searchUser.value;
        searchUser.value = '';
        if (value.length === 0) {

            ui.showFeedback('Invalid Input');

        } else {

            github.ajaxUser(value).then(data => ui.getUser(data)).catch(err => console.log(err));

        }
    });

    userList.addEventListener('click', e => {
        if (e.target.classList.contains('reposBtn')) {
            let userID = e.target.dataset.id;

            github.ajaxUser(userID).then(data => ui.displayRepos(userID, data.repos)).catch(err => console.log(err));
        }
    })
})();