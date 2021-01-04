Feature: Directory

  Scenario Outline: I go to the piece <name>
    When I visit "/"
    And I click the link "<name>"
    Then I am on "/<slug>"
    And I see "<contains>"

    Examples:
      | name                     | slug                    | contains                  |
      | Arturo                   | arturo                  | Arturo                    |
      | Avril 14th               | avril-14th              | Avril 14th                |
      | Songs Aren't Time Travel | songs-arent-time-travel | Songs aren’t time travel. |

  Scenario Outline: I got to the piece <name> in the haiku directory
    When I visit "/"
    And I click the link "haiku"
    And I click the link "<name>"
    Then I am on "/<slug>"
    And I see "<contains>"

    Examples:
      | name                | slug                      | contains         |
      | chasidic man        | haiku/chasidic-man        | smells like soup |
      | in my parents house | haiku/in-my-parents-house | time feels old   |
      | Parent Directory    |                           | Arturo           |
