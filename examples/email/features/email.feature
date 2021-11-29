Feature: Send email
    @user1 @mobile
    Scenario: My scenario 1
        Given I click view with ID "com.microsoft.office.outlook:id/btn_primary_button"
        When I click view with ID "com.microsoft.office.outlook:id/auto_complete_input_email"
        And I enter text "<EMAIL_1>"
        And I click view with ID "com.microsoft.office.outlook:id/btn_primary_button"
        And I wait for 8 seconds
        And I click coordinates X equal to 183 and Y equal to 676
        And I wait for 2 seconds
        And I enter text "<PASSWORD_1>"
        And I click coordinates X equal to 836 and Y equal to 1014
        And I wait for 2 seconds
        And I click view with ID "com.microsoft.office.outlook:id/bottom_flow_navigation_start_button"
        And I wait for 8 seconds
        And I click coordinates X equal to 949 and Y equal to 2033
        And I wait for 2 seconds
        And I click view with ID "com.microsoft.office.outlook:id/compose_to_field"
        And I enter text "<EMAIL_2>"
        And I press enter
        And I wait for 2 seconds
        And I click view with ID "com.microsoft.office.outlook:id/compose_subject_field"
        And I enter text "Test subject"
        And I wait for 2 seconds
        And I click view with ID "ms-outlook-mobile-rooster-writer"
        And I enter text "Testing"
        And I wait for 2 seconds
        And I click view with ID "com.microsoft.office.outlook:id/compose_send_button"
        And I wait
        Then I send a signal to user 2 containing "email_sent"

    @user2 @web
    Scenario: My scenario 2
        Given I navigate to page "https://www.gmail.com"
        When I wait for 2 seconds
        And I enter email "<EMAIL_2>"
        And I wait for 2 seconds
        And I click next
        And I wait for 2 seconds
        And I enter password "<PASSWORD_2>"
        And I wait for 2 seconds
        And I click next
        And I wait for a signal containing "email_sent" for 120 seconds
        And I click refresh emails
        And I wait
        Then I see email sent