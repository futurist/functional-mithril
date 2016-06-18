(function (m) {
  'use strict'

  var compose = (f, g) => (x) => f(g(x))
  var prop = k => obj => obj[k] ? obj[k] : ''
  var avatar = prop('avatar_url')
  var username = prop('login')
  var url = prop('html_url')

  var filterId = id => arr => arr.filter((_, i) => id != i)

  var requestUrl = since => 'https://api.github.com/users?since=' + since

  var randomize = (r) => Math.random() * r

  var requestCall = since => m.request({
    dataType: 'json',
    url: requestUrl(since),
    unwrapSuccess: response => response.map(item => ({
      avatar: avatar(item),
      username: username(item),
      url: url(item)
    }))
  })

  var getRequest = arg => {
    return arg=10;
  };

  var request = compose(requestCall, compose(Math.floor, randomize))

  var controller = () => {
    // the state
    var loaded = m.prop([])
    // mutate / request new data to Github
    var refresh = () => {
      loaded = request(500)
    }
    // get the suggested username
    var suggested = ()=> loaded().slice(0, 5)

    var remove = i => e => {
      e.preventDefault()
      var filtered = filterId(i)(loaded())
      loaded(filtered)
    }

    // refresh for first load
    refresh()
    // return the public method
    return {
      suggested,
      refresh,
      remove
    }
  }

  var view = ctrl => {
    return [
      m('div.header', [
        m('h2', 'Who to follow'),
        m('a', {href: '#', onclick: e => {
          e.preventDefault()
          ctrl.refresh()
        }}, 'refresh')
      ]),

      m('ul.suggestions', ctrl.suggested().map((item, i) => {
        return m('li', {key: item.url}, [
          m('a', {href: item.url, className: 'profile'}, [
            m('img', {src: item.avatar}),
            item.username
          ]),
          m('a', {href: '#', className: 'remove', onclick: ctrl.remove(i)}, 'x')
        ])
      }))
    ]
  };
  m.mount(document.getElementById('app'), m.component({controller, view}))
})(m)


