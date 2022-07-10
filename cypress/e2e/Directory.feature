Feature: Directory

  Scenario Outline: I go to the piece <name>
    When I visit "/"
    And I click the link "<name>" and refresh
    Then I am on "/<slug>"
    And I see "<contains>"

    Examples:
      | name                     | slug                    | contains                  |
      | Arturo                   | arturo                  | Arturo                    |
      | Avril 14th               | avril-14th              | Avril 14th                |
      | Songs Aren't Time Travel | songs-arent-time-travel | Songs aren’t time travel. |

  Scenario Outline: I got to the piece <name> in the haiku directory
    When I visit "/"
    And I click the link "haiku" and refresh
    And I click the link "<name>" and refresh
    Then I am on "/<slug>"
    And I see "<contains>"

    Examples:
      | name                | slug                      | contains         |
      | chasidic man        | haiku/chasidic-man        | smells like soup |
      | in my parents house | haiku/in-my-parents-house | time feels old   |
      | Parent Directory    |                           | Arturo           |

  Scenario: I visit a directory with a trailing slash
    When I visit "haiku/"
    And I click the link "dream haiku" and refresh
    Then I see "exploding drum"

  Scenario Outline: I sort pieces by <field>
    When I visit "haiku"
    And I click the link "<field>"
    Then I see the piece "<before>" before "<after>"
    When I click the link "<field>"
    Then I see the piece "<after>" before "<before>"

    Examples:
      | field         | before       | after        |
      # the 'name' example is in reverse, since when we sort by default by name; when we click "name" we reverse the sort
      | Name          | dream haiku  | chasidic man |
      | Last modified | chasidic man | three leaves |
      | Size          | chasidic man | palisades    |
      | Description   | chasidic man | palisades    |

  Scenario: I sort pieces with a trailing slash
    When I visit "haiku/"
    And I click the link "Last modified"
    # just check the page isn't broken
    Then I see "Index of haiku/"
