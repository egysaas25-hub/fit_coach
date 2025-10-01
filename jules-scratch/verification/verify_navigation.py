import re
from playwright.sync_api import sync_playwright, expect

def verify_super_admin_nav(page):
    # A page that uses the super-admin sidebar
    page.goto("http://localhost:3000/super-admin/tenants")
    # Check if the new link is present
    expect(page.get_by_role("link", name="Dashboard")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/super-admin-nav.png")

def verify_client_nav(page):
    # A page that uses the client sidebar
    page.goto("http://localhost:3000/client/dashboard")
    # Check if the new links are present
    expect(page.get_by_role("link", name="Progress")).to_be_visible()
    expect(page.get_by_role("link", name="Messages")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/client-nav.png")

def verify_trainer_nav(page):
    # A page that uses the trainer sidebar
    page.goto("http://localhost:3000/trainer/dashboard")
    # Check if the new link is present
    expect(page.get_by_role("link", name="Questions")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/trainer-nav.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        verify_super_admin_nav(page)
        verify_client_nav(page)
        verify_trainer_nav(page)

        browser.close()

if __name__ == "__main__":
    main()