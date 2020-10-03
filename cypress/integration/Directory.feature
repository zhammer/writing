Feature: Directory

  Scenario Outline: I go to the piece <name>
    When I visit "/"
    And I click the link "<name>"
    Then I am on "/<slug>"
    And I see "<contains>"

    Examples:
      | name                     | slug                    | contains                   |
      | Arturo                   | arturo                  | Arturo                     |
      | Avril 14th               | avril-14th              | Avril 14th                 |
      | Songs Aren't Time Travel | songs-arent-time-travel | Songs aren’t time travel. |
