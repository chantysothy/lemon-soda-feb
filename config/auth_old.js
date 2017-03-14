// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '582000448664812', // your App ID
        'clientSecret': '9b089aff5785a8b74f64ed3530f3d6f6', // your App Secret
		'callbackURL' 	: 'http://localhost:1337/auth/facebook/callback'
	},

    'twitterAuth' : {
		'consumerKey' 		: 'zR30W1z6cTQfYKaeMMrUdbXKm',
		'consumerSecret' 	: 'W3k4tedpDKJ0hM6Hnn2I4hAHWag1INFw2ipaBOhgYBqt5zaxL2',
		'callbackURL' 		: 'http://localhost:1337/auth/twitter/callback'
	},
    'twitterAppAuth' : {
        'consumer_key': 'wj888T3jlauiQIjcdu751AELB',
        'consumer_secret': 'oFTPhjo0TN7myprULXrk4Wl1WtY2H9lYu9wrIrQkicXtljwwii',
        'access_token': '103259010-14Fslxo1BpoGsEMCVKz41qxrj9aIRSRvzED9Q1an',
        'access_token_secret': 'l6YKbEkcAvFkCAiEBpbBT52GOfBuMcB6yAxyqPYxjzLBz'

		//'consumerKey' 		: 'zR30W1z6cTQfYKaeMMrUdbXKm',
		//'consumerSecret' 	: 'W3k4tedpDKJ0hM6Hnn2I4hAHWag1INFw2ipaBOhgYBqt5zaxL2',
		//'callbackURL' 		: 'http://localhost:1337/auth/twitter/callback'
    },

	'googleAuth' : {
		'clientID' 		: 'your-secret-clientID-here',
		'clientSecret' 	: 'your-client-secret-here',
		'callbackURL' 	: 'http://localhost:1337/auth/google/callback'
	},
    'instagram' : {
        'clientID' 		: 'your-secret-clientID-here',
        'clientSecret' 	: 'your-client-secret-here',
        'callbackURL' 	: 'http://localhost:1337/auth/instagram/callback'
    },
    'linkedin' : {
        'clientID' 		: 'your-secret-clientID-here',
        'clientSecret' 	: 'your-client-secret-here',
        'callbackURL' 	: 'http://localhost:1337/auth/linkedin/callback'
    }


};