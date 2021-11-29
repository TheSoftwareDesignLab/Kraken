Feature: Like and unlike a facebook post

    @user1 @mobile
    Scenario: My scenario 1
        Given I wait for 1 seconds
        When I click email input
        And I wait for 1 seconds
        And I enter text "<EMAIL_1>"
        And I wait for 1 seconds
        And I click password input
        And I wait for 1 seconds
        And I enter text "<PASSWORD_1>"
        And I wait for 1 seconds
        And I click login
        And I wait for 5 seconds
        And I skip contacts slide
        And I wait for 1 seconds
        And I click on whats on your mind input
        And I wait for 1 seconds
        And I enter text "Testing post likes" for post
        And I wait for 1 seconds
        And I create post
        And I wait for 1 seconds
        And I like the post
        Then I send a signal to user 2 containing "liked_post"

    @user2 @web
    Scenario: My scenario 2
        Given I navigate to page "https://www.facebook.com"
        When I click view with selector "#email"
        And I enter text "<EMAIL_1>"
        And I click view with selector "#pass"
        And I enter text "<PASSWORD_1>"
        And I wait for 2 seconds
        And I click view with selector "button[name='login']"
        And I wait for a signal containing "liked_post" for 120 seconds
        And I click view with selector "a[href='https://www.facebook.com/drummerwilliam']"
        And I wait
        And I scroll to first post
        And I wait for 2 seconds
        And I go to first post detail
        And I wait for 2 seconds
        And I see that the post is liked
        And I unlike the post
        And I wait for 2 seconds
        And I see that the post is not liked
