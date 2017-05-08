module.exports = {

    twitter: {
        keys: {
            'consumer_key': 'tf3dm7LlhHPeYOmNpEL3yNJe7'
            , 'consumer_secret': 'Ii1hkP9e9kx91DL1CWg0oD88h13cfxdqu46L2Yj92XjIoqnsdm'
            , 'access_token': '789724956850462720-YvR6TlMs9PNbotV6n0ub4cNmo5u2TH3'
            , 'access_token_secret': 'bAuiK9JNNylqIQv5jwOiku3qiXU45KYhhrCp70HlUKUP9'
            , 'redirect_url': 'https://localhost:8443/auth/twitter/callback'
        }
        , urls : {
            'request_token_url': 'https://api.twitter.com/oauth/request_token'
            , 'access_token_url': 'https://api.twitter.com/oauth/access_token'
            , 'authenticate_url': 'https://api.twitter.com/oauth/authenticate'
            , 'authorize_url': 'https://api.twitter.com/oauth/authorize'
            , 'rest_base': 'https://api.twitter.com/1.1'
            , 'search_base': 'https://search.twitter.com'
            , 'stream_base': 'https://stream.twitter.com/1.1'
            , 'user_stream_base': 'https://userstream.twitter.com/1.1'
            , 'site_stream_base': 'https://sitestream.twitter.com/1.1'
            , 'lists': 'https://api.twitter.com/1.1/lists/list.json'//?screen_name=edwardvarghese
            , 'redirect_url': "https://nectorr.com/auth/twitter/callback"
        }
        // for updating to git once again and again
        //,
        //bearer_token:''
        //test
	},
    facebookAuth: {
        'client_id': '334582780223007'//334582780223007 nectorr.com
        , 'client_secret': 'a26f07a41208de4ac64849ae66d5efb8'
        , 'redirect_uri': 'https://nectorr.com/auth/facebook/callback'
        , 'code': 'EAAEwTRZCDXh8BAL5AtzF9Lt5VAu2aKYnGHLIz7h0MmkpSogLyQ4nK7lH4HNiGV13PJRVWKd3vZAu4MxZAZCmkqkxIasQZAcZByhwvvd5eqyYDlMS7M04uagHAXa9mNwTrZCtPxYhRDotE6MlinTmhtQBCnTsE8JHcJUyZB0ZChkTidAZDZD'
        , "app_access_token": "334582780223007|pcBi6IRMusRbUG7CsMDZrgwpK_E"
        , 'client_token': "d80531e7f68bff968cefa7454be5716c"
        //,
        //bearer_token:''
        //test
    },
    google: {
        clientId: '288544546525-2j9eagljdg25ojrddm33cmcqplcvu3g0.apps.googleusercontent.com'
        , clientSecret: 'iQpmP8C4RGQ21KZelGqrIqhu'
        , apiKey: 'AIzaSyBwtfeYOCtESyR4F8FmX9I0NrqatD4FIuM'
        //AIzaSyCPIvHA2J4mbhEcwCZHm06EKZ86o5PlnyY
        , scopes: {
            plusMe: 'https://www.googleapis.com/auth/plus.me'
            , plusLogin: 'https://www.googleapis.com/auth/plus.login'
            , profilesRead: 'https://www.googleapis.com/auth/plus.profiles.read'
            , plusCirclesRead: 'https://www.googleapis.com/auth/plus.circles.read'
            , plusStreamRead: 'https://www.googleapis.com/auth/plus.stream.read'
            , plusStreamWrite: 'https://www.googleapis.com/auth/plus.stream.write'
            , plusCirclesWrite: 'https://www.googleapis.com/auth/plus.circles.write'
            , plusUserInfoProfile: 'https://www.googleapis.com/auth/userinfo.profile'
            , plusMediaUpload: 'https://www.googleapis.com/auth/plus.media.upload'
            , youTubeAuth: 'https://www.googleapis.com/auth/youtube'
            , urlShortnerAuth: 'https://www.googleapis.com/auth/urlshortener'
        }
    }

};