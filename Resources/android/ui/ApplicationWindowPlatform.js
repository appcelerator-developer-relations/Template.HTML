// Application Window Component Constructor, android specific
function ApplicationWindowPlatform(/*TiUIWindow*/self, /*TiUIView*/webView, /*boolean*/titleBarOn, /*boolean*/drawerOn) {
    // A note about the NavBar:
    // - We use the nav bar along with some navigation buttons on iOS.
    // - We use the menu on Android to handle forward/back
    // - For mobile web, we rely on the forward/back button in the browser

    if(titleBarOn) {
        // When the webview loads, set the title and enable the left/right nav button
        webView.addEventListener('load', function(e) {
            self.title = webView.evalJS('document.title');
        });
    }

    // Handle Android back button.
    self.addEventListener('android:back', function() {
        if(webView.canGoBack()) {
            webView.goBack();
        } else {
            self.close();
        }
    });
    
    if (drawerOn) {    
        // Create the Android menu.
        var FORWARD = 1, BACK = 2;
        var activity = self.activity;
        activity.onCreateOptionsMenu = function(e) {
            var menu = e.menu;
            var menuItem = menu.add({
                title : L('back'),
                itemId : BACK
            });
            menuItem.setIcon('/images/LeftArrow.png');
            menuItem.addEventListener('click', function(e) {
                webView.goBack();
            });
            menuItem = menu.add({
                title : L('forward'),
                itemId : FORWARD
            });
            menuItem.setIcon('/images/RightArrow.png');
            menuItem.addEventListener('click', function(e) {
                webView.goForward();
            });
        };
        activity.onPrepareOptionsMenu = function(e) {
            var menu = e.menu;
            var menuItem = menu.findItem(BACK);
            menuItem.enabled = webView.canGoBack();
            menuItem = menu.findItem(FORWARD);
            menuItem.enabled = webView.canGoForward();
        };
    }
}

module.exports = ApplicationWindowPlatform;
