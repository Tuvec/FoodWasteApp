const facebookAppId = process.env.REACT_APP_FB_KEY;

export function initFacebookSdk() {
    return new Promise(resolve => {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: facebookAppId,
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v9.0'
            });

            resolve();
        };
    })
}