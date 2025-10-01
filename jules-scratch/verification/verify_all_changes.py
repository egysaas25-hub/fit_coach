import re
from playwright.sync_api import sync_playwright, expect

def verify_super_admin_dashboard(page):
    page.goto("http://localhost:3000/super-admin/dashboard")
    expect(page.get_by_role("heading", name="Super-Admin Dashboard")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/super-admin-dashboard.png")

def verify_client_progress_tracking(page):
    page.goto("http://localhost:3000/client/progress-tracking")
    expect(page.get_by_role("heading", name="Progress Tracking")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/client-progress-tracking.png")

def verify_trainer_questions(page):
    page.goto("http://localhost:3000/trainer/questions")
    expect(page.get_by_role("heading", name="Client Questions")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/trainer-questions.png")

def verify_client_messages(page):
    page.goto("http://localhost:3000/client/messages")
    expect(page.get_by_role("heading", name="Messages")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/client-messages.png")

def verify_super_admin_nav(page):
    page.goto("http://localhost:3000/super-admin/tenants")
    expect(page.get_by_role("link", name="Dashboard")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/super-admin-nav.png")

def verify_client_nav(page):
    page.goto("http://localhost:3000/client/dashboard")
    expect(page.get_by_role("link", name="Progress")).to_be_visible()
    expect(page.get_by_role("link", name="Messages")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/client-nav.png")

def verify_trainer_nav(page):
    page.goto("http://localhost:3000/trainer/dashboard")
    expect(page.get_by_role("link", name="Questions")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/trainer-nav.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        verify_super_admin_dashboard(page)
        verify_client_progress_tracking(page)
        verify_trainer_questions(page)
        verify_client_messages(page)
        verify_super_admin_nav(page)
        verify_client_nav(page)
        verify_trainer_nav(page)

        browser.close()

if __name__ == "__main__":
    main()