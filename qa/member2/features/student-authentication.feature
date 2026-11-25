Feature: Student Authentication
  As a registered university student
  I want to securely log into the LabTrack portal
  So that I can access my assignments, submit laboratory work, and view graded feedback

  Background:
    Given a registered student exists with email "student.bdd@example.test" and password "StudentPass123!"

  Scenario: Successful student login
    When the student attempts to log in with email "student.bdd@example.test" and password "StudentPass123!"
    Then the authentication response status code should be 200
    And the response should contain a valid JWT authentication token
    And the returned user profile should have role "student" and email "student.bdd@example.test"
    And the returned user profile should not expose password or sensitive hash data

  Scenario: Student login with incorrect credentials
    When the student attempts to log in with email "student.bdd@example.test" and password "WrongPassword999!"
    Then the authentication response status code should be 401
    And the response error message should be "Invalid email or password."
    And no authentication token should be returned
