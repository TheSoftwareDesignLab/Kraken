Feature: Play game kahoot
    @user1 @mobile
    Scenario: My scenario 1
        Given I click view with ID "no.mobitroll.kahoot.android:id/nextButton"
        And I wait for 2 seconds
        And I click view with xpath "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.RelativeLayout/android.widget.LinearLayout[2]/android.view.ViewGroup/android.widget.FrameLayout[2]/android.widget.FrameLayout/android.widget.TextView"
        And I wait for 2 seconds
        And I click view with ID "no.mobitroll.kahoot.android:id/ageInput"
        And I wait for 2 seconds
        And I enter text "24"
        And I click view with ID "no.mobitroll.kahoot.android:id/okButton"
        And I wait for 2 seconds
        And I click view with ID "no.mobitroll.kahoot.android:id/pinTab"
        And I wait
        And I click view with ID "game-input"
        And I wait
        And I enter game code
        And I click view with xpath "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.RelativeLayout/android.webkit.WebView/android.webkit.WebView/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.Button"
        And I wait for 2 seconds
        And I click view with ID "nickname"
        And I wait for 2 seconds
        And I enter text "William"
        And I click view with xpath "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.RelativeLayout/android.webkit.WebView/android.webkit.WebView/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.Button"
        And I send a signal to user 2 containing "ready_to_start"
        And I wait for a signal containing "game_started" for 120 seconds
        And I wait for 15 seconds
        And I click view with xpath "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.RelativeLayout/android.webkit.WebView/android.webkit.WebView/android.view.View/android.view.View/android.view.View/android.widget.Button[1]"
        And I send a signal to user 2 containing "finished"
        And I wait for 10 seconds
        And I click view with ID "no.mobitroll.kahoot.android:id/doneButton"
        Then I wait

    @user2 @web
    Scenario: My scenario 2
        Given I navigate to page "https://kahoot.com/"
        When I go to login
        And I enter email "<EMAIL>"
        And I enter password "<PASSWORD>"
        And I click login
        And I go to test
        And I click play on test
        And I select teach mode
        And I select classic mode
        And I send game code to user 1
        And I wait for a signal containing "ready_to_start" for 120 seconds
        And I send a signal to user 1 containing "game_started"
        
        
        And I wait for a signal containing "finished" for 120 seconds
        And I click next
        Then I wait
