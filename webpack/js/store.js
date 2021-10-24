import React from 'react';
import {render} from 'react-dom'
import App from './app.jsx'
import Superagent from 'superagent'
Object.assign = require('object-assign');

import PublicLayout from './layouts/PublicLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import BlankLayout from './layouts/BlankLayout.jsx'

import MainPageView from './views/public/MainPageView.jsx'
import ErrorView from './views/public/ErrorView.jsx'
import PageView from './views/public/PageView.jsx'
import PhotosView from './views/public/PhotosView.jsx'
import CollectionView from './views/public/CollectionView.jsx'
import AuthView from './views/public/AuthView.jsx'
import CommentsView from './views/public/CommentsView.jsx'
import ArticleView from './views/public/ArticleView.jsx'
import NoveltyView from './views/public/NoveltyView.jsx'
import HealingView from './views/public/HealingView.jsx'
import ContactsView from './views/public/ContactsView.jsx'
import PricesView from './views/public/PricesView.jsx'

import AdminStaticPagesView from './views/admin/AdminStaticPagesView.jsx'
import AdminPagesView from './views/admin/AdminPagesView.jsx'
import AdminArticlesView from './views/admin/AdminArticlesView.jsx'
import AdminHealingsView from './views/admin/AdminHealingsView.jsx'
import AdminPhotosView from './views/admin/AdminPhotosView.jsx'
import AdminMediaLibraryView from './views/admin/AdminMediaLibraryView.jsx'
import AdminPhotoCategoriesView from './views/admin/AdminPhotoCategoriesView.jsx'
import AdminCommentsView from './views/admin/AdminCommentsView.jsx'
import AdminNoveltiesView from './views/admin/AdminNoveltiesView.jsx'
import AdminBannersView from './views/admin/AdminBannersView.jsx'
import AdminContactsView from './views/admin/AdminContactsView.jsx'
import AdminPricesView from './views/admin/AdminPricesView.jsx'

const Store = {
    data: { drawer: false, modal: false },
    assets_version: false,

    getData: function (key) {
        if (key) {
            return this.data[key];
        } else {
            return this.data;
        }
    },

    getLayout: function () {
        let layoyts = {
            'PublicLayout': PublicLayout,
            'AdminLayout':  AdminLayout,
            'BlankLayout':  BlankLayout
        };
        return layoyts[this.data.layout];
    },

    getView: function () {
        let views = {
            'MainPageView':                 MainPageView,
            'ErrorView':                    ErrorView,
            'PageView':                     PageView,
            'PhotosView':                   PhotosView,
            'CollectionView':               CollectionView,
            'AuthView':                     AuthView,
            'CommentsView':                 CommentsView,
            'ArticleView':                  ArticleView,
            'NoveltyView':                  NoveltyView,
            'HealingView':                  HealingView,
            'ContactsView':                 ContactsView,
            'PricesView':                   PricesView,
            'AdminStaticPagesView':         AdminStaticPagesView,
            'AdminPagesView':               AdminPagesView,
            'AdminArticlesView':            AdminArticlesView,
            'AdminHealingsView':            AdminHealingsView,
            'AdminPhotosView':              AdminPhotosView,
            'AdminMediaLibraryView':        AdminMediaLibraryView,
            'AdminPhotoCategoriesView':     AdminPhotoCategoriesView,
            'AdminCommentsView':            AdminCommentsView,
            'AdminNoveltiesView':           AdminNoveltiesView,
            'AdminBannersView':             AdminBannersView,
            'AdminContactsView':            AdminContactsView,
            'AdminPricesView':              AdminPricesView
        };
        return views[this.data.view];
    },

    getComponent: function (id) {
        return this.data.components[id];
    },

    csrfToken: function () {
        return this.data.csrfToken;
    },

    setData: function (data, refresh) {

        this.data = Object.assign(this.data, data);

        if (refresh) {
            if (this.assets_version && this.assets_version != this.data['assets_version']) {
                location.reload();
            }
            this.assets_version = this.data['assets_version'];
            this.setState(this.data);
        }
    },

    plur: function (number, titles) {
        let cases = [2, 0, 1, 1, 1, 2];
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    },

    isCurrentUrl: function (url) {
        return this.data.url == url
    },

    isParentUrl: function (url) {
        return this.data.url.indexOf(url + '/') == 0 || this.data.url.indexOf(url + '?') == 0
    },

    isCurrentOrParentUrl: function (url) {
        return this.isCurrentUrl(url) || this.isParentUrl(url);
    },

    backTo: function (data) {
        this.setData(data, true);
    },

    updatePage: function (data) {
        data.drawer = false;
        history.pushState(data, data.title, data.url);
        document.title = data.title;
        this.setData(data, true);
        window.scrollTo(0, 0);
    },

    urlNormalize: function (url) {
        if (url == '/') {
            return '/index.json'
        } else {
            url = url.split('?');
            url[0] += '.json';
            url = url.join('?');
            return url
        }
    },

    goTo: function (url) {
        url = this.urlNormalize(url);

        Superagent.get(url).set('Accept', 'application/json').end(function (err, res) {
            if (res.ok) {
                let data = JSON.parse(res.text);
                this.updatePage(data);
            }
        }.bind(this));
    },

    getUrlData: function (url) {
        return new Promise((resolve, reject) => {
            url = this.urlNormalize(url);

            Superagent.get(url).set('Accept', 'application/json').end(function (err, res) {
                if (res.ok) {
                    resolve(JSON.parse(res.text));
                } else {
                    reject(err)
                }
            });
        })
    },

    goToPost: function (url) {
        url = this.urlNormalize(url);

        Superagent.post(url).set('Accept', 'application/json').send({csrf_token: this.data.csrfToken}).end(function (err, res) {
            if (res.ok) {
                let data = JSON.parse(res.text);
                this.updatePage(data);
            }
        }.bind(this));
    },

    simplePost: function (url, data, method = "post", update = true) {
        return new Promise((resolve, reject) => {
            url = this.urlNormalize(url);
            if (!data) {
                data = {};
            }

            Superagent(method, url).set('Accept', 'application/json')
                .send({csrf_token: this.data.csrfToken}).send(data)
                .end((err, res) => {
                    if (res.ok) {
                        let data = JSON.parse(res.text);
                        this.setData(data, update);
                        resolve(data)
                    } else {
                        reject(err)
                    }
                });
        })
    },

    sendFormPost: function (url, data, method = "post") {
        url = this.urlNormalize(url);

        Superagent(method, url).set('Accept', 'application/json').send(data).end(function (err, res) {
            if (res.ok) {
                let data = JSON.parse(res.text);
                this.updatePage(data);
            }
        }.bind(this));
    },

    sendFormGet: function (url, data) {
        url = this.urlNormalize(url);
        let params = []

        if (Object.keys(data).length > 0) {
            for (let paramName in data) {
                params.push(paramName + '=' + data[paramName])
            }

            url += "?" + params.join('&')
        }

        Superagent.get(url).set('Accept', 'application/json').end(function (err, res) {
            if (res.ok) {
                let data = JSON.parse(res.text);
                this.updatePage(data);
            }
        }.bind(this));
    },


    initData: function (data) {
        this.data = Object.assign(this.data, data);
        history.replaceState(data, data.title, data.url);
        render(
            <App/>,
            document.getElementById('app')
        );
    },
};

export default Store
