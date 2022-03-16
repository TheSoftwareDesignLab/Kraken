Feature: Send email
    @user1 @mobile
    Scenario: My scenario 1
        Given I click add new account view
        When I enter text "<EMAIL_1>"
        And I enter text "<PASSWORD_1>"
        And I click continue
        And I skip introductory slide
        And I click create new email
        And I enter receiver "<EMAIL_2>"
        And I enter subject "Test subject"
        And I enter body "Testing"
        And I click send
        Then I send a signal to user 2 containing "email_sent"

    @user2 @web
    Scenario: My scenario 2
        Given I navigate to page "https://www.gmail.com"
        When I enter email "<EMAIL_2>"
        And I enter password "<PASSWORD_2>"
        And I click next
        And I wait for a signal containing "email_sent" for 120 seconds
        And I click refresh emails
        Then I see email sent
