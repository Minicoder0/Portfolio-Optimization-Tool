# PortfolioIQ — Smart Portfolio Optimization Tool

> An educational + functional portfolio optimization web application that guides complete beginners through building their own optimized investment portfolio — no finance degree required.

---

## 🧠 Project Overview

**PortfolioIQ** is a full-stack web application built with Next.js 14, Firebase, and a Python FastAPI backend. It combines real financial optimization algorithms (Markowitz Mean-Variance) with a beginner-first design philosophy — every number, chart and concept is explained in plain English alongside the full mathematical detail for advanced users.

**Built by:** Minhal (Minhal's Studio)
**Stack:** Next.js 14 · Firebase Auth · Firestore · FastAPI · Python · pypfopt · yfinance · Recharts · Tailwind CSS
**Deployed:** Vercel (frontend) · Railway (Python backend)

---

## 📋 Table of Contents

- [Feature 1.0 — Landing Page](#feature-10--landing-page)
- [Feature 2.0 — Authentication System](#feature-20--authentication-system)
- [Feature 3.0 — Stock Search](#feature-30--stock-search)
- [Feature 4.0 — Date Range Selector](#feature-40--date-range-selector)
- [Feature 5.0 — Portfolio Optimizer](#feature-50--portfolio-optimizer)
- [Feature 6.0 — Results: Pie Chart](#feature-60--results-pie-chart)
- [Feature 7.0 — Results: Bar Chart](#feature-70--results-bar-chart)
- [Feature 8.0 — Performance Summary](#feature-80--performance-summary)
- [Feature 9.0 — Plain English Explanations](#feature-90--plain-english-explanations)
- [Feature 10.0 — Beginner / Advanced Toggle](#feature-100--beginner--advanced-toggle)
- [Feature 11.0 — Save Portfolio](#feature-110--save-portfolio)
- [Feature 12.0 — Portfolio History](#feature-120--portfolio-history)
- [Feature 13.0 — Responsive Design](#feature-130--responsive-design)

---

## Feature 1.0 — Landing Page

> The first thing any visitor sees. Makes the user understand what the tool is and why they should care — all within 5 seconds of landing.

### Epic 1.1 — Hero Section
- **Story 1.1.1** — Display animated terminal-style headline text that types itself out on load
- **Story 1.1.2** — Add subheadline explaining what the tool does in one sentence
- **Story 1.1.3** — Add CTA button "Get Started Free" that routes to Sign Up page

### Epic 1.2 — Concept Cards Section
- **Story 1.2.1** — Card 1: Explain what a portfolio is in plain English with no jargon
- **Story 1.2.2** — Card 2: Explain what optimization means without any math
- **Story 1.2.3** — Card 3: Explain what the tool will do for the user step by step

### Epic 1.3 — How It Works Section
- **Story 1.3.1** — Display 3-step visual flow: Pick Stocks → Run Math → Get Results
- **Story 1.3.2** — Add 4 key feature highlights with icons and one-line descriptions

### Epic 1.4 — Footer
- **Story 1.4.1** — Add project name, Minhal's Studio credit and GitHub link
- **Story 1.4.2** — Add navigation links: Home, Login, Sign Up, Glossary

---

## Feature 2.0 — Authentication System

> Login and signup system giving each user their own private account. Built on Firebase Auth — zero security code written manually.

### Epic 2.1 — Sign Up
- **Story 2.1.1** — Build sign up form with Name, Email and Password fields
- **Story 2.1.2** — Add password show/hide toggle on the password field
- **Story 2.1.3** — Validate inputs inline — show errors without submitting the form
- **Story 2.1.4** — Create user account in Firebase Auth on successful submit
- **Story 2.1.5** — Save user name and email to Firestore on first sign up
- **Story 2.1.6** — Show clear error if email already exists: "An account with this email already exists"

### Epic 2.2 — Login
- **Story 2.2.1** — Build login form with Email and Password fields
- **Story 2.2.2** — Authenticate user via Firebase and redirect to dashboard on success
- **Story 2.2.3** — Show error on wrong credentials without revealing which field is wrong
- **Story 2.2.4** — Add Forgot Password link that sends a reset email via Firebase

### Epic 2.3 — Google Sign In
- **Story 2.3.1** — Add "Continue with Google" OAuth button on both login and signup pages
- **Story 2.3.2** — Auto-create Firestore profile for first-time Google sign in users
- **Story 2.3.3** — Redirect returning Google users straight to dashboard

### Epic 2.4 — Protected Routes
- **Story 2.4.1** — Redirect unauthenticated users away from /dashboard to /login
- **Story 2.4.2** — Redirect logged-in users away from /login and /signup to /dashboard
- **Story 2.4.3** — Persist auth state across page refreshes and browser restarts

### Epic 2.5 — Logout
- **Story 2.5.1** — Add logout button in dashboard navbar top right
- **Story 2.5.2** — Clear Firebase session and redirect to landing page on logout

---

## Feature 3.0 — Stock Search

> The entry point of the entire tool. Users search by company name — not ticker symbols — making it accessible to complete beginners.

### Epic 3.1 — Search Input
- **Story 3.1.1** — Build search bar with placeholder "Search for a company e.g. Apple, Tesla..."
- **Story 3.1.2** — Show live dropdown suggestions as user types using Financial Modeling Prep API
- **Story 3.1.3** — Display company name as primary info and ticker as secondary in dropdown results
- **Story 3.1.4** — Route API calls through Next.js API route to keep API key hidden server-side
- **Story 3.1.5** — Clear search bar after user selects a stock and keep it ready for next input

### Epic 3.2 — Selected Stocks List
- **Story 3.2.1** — Display selected stocks as removable chips below the search bar
- **Story 3.2.2** — Each chip shows company name and ticker with an X remove button
- **Story 3.2.3** — Enforce minimum of 2 stocks with warning: "Add at least 2 stocks to optimize"
- **Story 3.2.4** — Enforce maximum of 10 stocks with warning: "You've reached the maximum of 10 stocks"
- **Story 3.2.5** — Detect and block duplicate stocks with warning: "[Company] is already in your list"

### Epic 3.3 — Stock Preview Cards
- **Story 3.3.1** — Show a preview card for each added stock displaying sector, 1Y return and risk level
- **Story 3.3.2** — Color code 1Y return: green for positive, red for negative
- **Story 3.3.3** — Display risk level in plain English: Low / Medium / High / Very High
- **Story 3.3.4** — Calculate risk level from volatility ranges behind the scenes — never show raw σ in beginner mode

---

## Feature 4.0 — Date Range Selector

> Step 2 of the dashboard. Lets users set the historical period the optimizer analyzes — guided toward the best choice without requiring any financial knowledge.

### Epic 4.1 — Quick Preset Buttons
- **Story 4.1.1** — Display three preset buttons: 1Y, 3Y, 5Y with plain English descriptions
- **Story 4.1.2** — Pre-select 3Y by default with label "Recommended — balanced view of performance"
- **Story 4.1.3** — Auto-fill start and end date fields when a preset is clicked

### Epic 4.2 — Manual Date Pickers
- **Story 4.2.1** — Add start date and end date input fields with calendar popup
- **Story 4.2.2** — Link fields so end date can never be set before start date
- **Story 4.2.3** — Highlight end date field in red with error message if dates are reversed
- **Story 4.2.4** — Auto-cap end date at yesterday to ensure complete market data is available

### Epic 4.3 — Validation and Warnings
- **Story 4.3.1** — Show yellow warning if date range is under 6 months: "Short ranges give unreliable results"
- **Story 4.3.2** — Show yellow warning if date range exceeds 10 years: "Very old data may not reflect today's performance"
- **Story 4.3.3** — Allow user to proceed past warnings but ensure they are clearly informed

### Epic 4.4 — Plain English Context Block
- **Story 4.4.1** — Show an explanation card in Beginner Mode explaining why the date range matters
- **Story 4.4.2** — Hide this context block in Advanced Mode automatically

---

## Feature 5.0 — Portfolio Optimizer

> The brain of the entire tool. Runs real Markowitz Mean-Variance optimization using pypfopt and yfinance on a Python FastAPI backend deployed to Railway.

### Epic 5.1 — FastAPI Backend
- **Story 5.1.1** — Set up FastAPI project with pypfopt, yfinance and CORS configured for Vercel domain
- **Story 5.1.2** — Build POST /optimize endpoint accepting tickers array and date range
- **Story 5.1.3** — Fetch historical closing prices via yfinance for the given tickers and date range
- **Story 5.1.4** — Compute expected returns (μ) using mean historical return
- **Story 5.1.5** — Compute covariance matrix (Σ) using sample covariance
- **Story 5.1.6** — Run max Sharpe ratio optimization via EfficientFrontier
- **Story 5.1.7** — Clean weights by removing allocations under 1%
- **Story 5.1.8** — Return structured JSON: weights, expected return, volatility, Sharpe, individual stock stats
- **Story 5.1.9** — Generate Monte Carlo simulation data (500 random portfolios) for efficient frontier plot
- **Story 5.1.10** — Add GET /health endpoint for uptime monitoring
- **Story 5.1.11** — Deploy FastAPI backend to Railway with environment variables secured

### Epic 5.2 — Backend Error Handling
- **Story 5.2.1** — Return clear error for invalid ticker: "We couldn't find data for X. Did you mean Y?"
- **Story 5.2.2** — Return clear error for insufficient data: "Not enough price history for this date range"
- **Story 5.2.3** — Return clear error if optimization fails to converge: "Try adding more diverse stocks"
- **Story 5.2.4** — Return clear error if Yahoo Finance is unavailable: "Market data temporarily unavailable"

### Epic 5.3 — Optimize Button
- **Story 5.3.1** — Display full-width "Optimize My Portfolio" button below date range section
- **Story 5.3.2** — Disable button and gray it out until user has at least 2 stocks and a valid date range
- **Story 5.3.3** — Trigger POST /optimize API call on button click

### Epic 5.4 — Loading State
- **Story 5.4.1** — Show animated terminal-style loading messages cycling during optimization
- **Story 5.4.2** — Display Beginner Mode messages in plain English: "Downloading price history..."
- **Story 5.4.3** — Display Advanced Mode messages with technical language: "Computing covariance matrix Σ..."
- **Story 5.4.4** — Show contextual explanation card during loading in Beginner Mode explaining what is happening

---

## Feature 6.0 — Results: Pie Chart

> The first result the user sees — a visual breakdown of how their money should be split across chosen stocks.

### Epic 6.1 — Pie Chart Rendering
- **Story 6.1.1** — Render pie chart using Recharts with one slice per stock
- **Story 6.1.2** — Animate slices growing from center outward on results load
- **Story 6.1.3** — Use terminal green color palette with distinct shades per slice
- **Story 6.1.4** — Show stock ticker label directly on slice if large enough; use pointer line for small slices
- **Story 6.1.5** — Display legend below chart with color dot, company name and percentage per stock

### Epic 6.2 — Hover Tooltip
- **Story 6.2.1** — Show tooltip on hover (desktop) or tap (mobile) for each slice
- **Story 6.2.2** — Beginner Mode tooltip: company name, weight percentage, "Put $X of every $100 here"
- **Story 6.2.3** — Advanced Mode tooltip: exact decimal weight, individual expected return and volatility

### Epic 6.3 — Weight Summary Table
- **Story 6.3.1** — Render table below chart: Company, Ticker, Weight, Per $1,000 invested
- **Story 6.3.2** — Add investment amount input field defaulting to $1,000
- **Story 6.3.3** — Update "Per $X,000" column live as user types a different investment amount

### Epic 6.4 — Diversification Score
- **Story 6.4.1** — Calculate diversification score from average pairwise correlation of selected stocks
- **Story 6.4.2** — Display score as a progress bar with label out of 100
- **Story 6.4.3** — Show plain English verdict: Concentrated / Moderate / Well Diversified

---

## Feature 7.0 — Results: Bar Chart

> Shows each stock's individual risk vs return alongside the optimized portfolio — visually proving why the optimizer made its decisions.

### Epic 7.1 — Grouped Bar Chart
- **Story 7.1.1** — Render grouped bar chart using Recharts with two bars per stock: Expected Return and Volatility
- **Story 7.1.2** — Solid green bar for Expected Return, outlined bar for Volatility per stock group
- **Story 7.1.3** — Animate bars growing upward from x-axis with staggered entrance per stock group

### Epic 7.2 — Portfolio Bar
- **Story 7.2.1** — Add portfolio group at the right end of the chart with brighter color to distinguish it
- **Story 7.2.2** — Annotate portfolio bars with "★ Your Optimized Portfolio — Best return for the least risk"

### Epic 7.3 — Axis Labels
- **Story 7.3.1** — Beginner Mode: Y-axis label "Yearly % Change", X-axis label "Your Stocks"
- **Story 7.3.2** — Advanced Mode: Y-axis label "Expected Return μ / Volatility σ"
- **Story 7.3.3** — Add ⓘ tooltip on Y-axis explaining what the values represent in plain English

### Epic 7.4 — Hover Tooltips
- **Story 7.4.1** — Individual stock tooltip: name, expected return, volatility, plain English risk level, one-sentence explanation
- **Story 7.4.2** — Portfolio tooltip: metrics summary and plain English explanation of how combining stocks reduced overall risk

### Epic 7.5 — Risk Level Color Coding
- **Story 7.5.1** — Apply subtle background tint behind each stock group: green (low), yellow (medium), red (high), orange (very high)
- **Story 7.5.2** — Calculate risk levels from volatility: under 15% Low, 15-25% Medium, 25-35% High, above 35% Very High

### Epic 7.6 — Sort Toggle
- **Story 7.6.1** — Add sort toggle above chart: Return ↓ / Risk ↓ / Weight ↓
- **Story 7.6.2** — Re-animate bars in new order when sort option is clicked

---

## Feature 8.0 — Performance Summary

> Three metric cards — Expected Return, Volatility and Sharpe Ratio — each with plain English labels and color-coded verdict badges.

### Epic 8.1 — Three Metric Cards
- **Story 8.1.1** — Display three cards side by side: Expected Return, Volatility, Sharpe Ratio
- **Story 8.1.2** — Each card shows: large number, technical name, plain English label, verdict badge
- **Story 8.1.3** — Animate numbers counting up from zero to final value over 1.5 seconds on load

### Epic 8.2 — Expected Return Card
- **Story 8.2.1** — Show expected return as percentage with label "Estimated yearly gain"
- **Story 8.2.2** — Show "On $X that's +$Y/yr" using the investment amount from Feature 6.0
- **Story 8.2.3** — Apply verdict badge: Excellent / Strong / Moderate / Modest / Low based on percentage thresholds
- **Story 8.2.4** — Add ⓘ tooltip with disclaimer: "Past performance does not guarantee future results"

### Epic 8.3 — Volatility Card
- **Story 8.3.1** — Show volatility as percentage with label "Risk Level"
- **Story 8.3.2** — Show "In a typical year this portfolio could swing up OR down by X%" explanation
- **Story 8.3.3** — Show "On $X that's ±$Y" using investment amount
- **Story 8.3.4** — Apply verdict badge: Low Risk / Medium Risk / High Risk / Very High Risk

### Epic 8.4 — Sharpe Ratio Card
- **Story 8.4.1** — Show Sharpe Ratio with label "Reward per unit of risk"
- **Story 8.4.2** — Beginner Mode tooltip: "Think of this as your portfolio efficiency score. Above 1.0 is good"
- **Story 8.4.3** — Advanced Mode tooltip: show full Sharpe formula with actual numbers filled in
- **Story 8.4.4** — Apply verdict badge: Excellent / Good / Acceptable / Poor based on Sharpe thresholds
- **Story 8.4.5** — Add "Compared to just holding cash: much better" context line

### Epic 8.5 — Overall Portfolio Verdict
- **Story 8.5.1** — Generate auto-filled plain English verdict paragraph using actual stock names and numbers
- **Story 8.5.2** — Apply overall verdict label: Strong Portfolio / Good Portfolio / Acceptable / Weak Portfolio
- **Story 8.5.3** — Color code verdict label border: green glow for strong, yellow for moderate, red for weak

### Epic 8.6 — Benchmark Comparison (Advanced Mode Only)
- **Story 8.6.1** — Show comparison table: Your Portfolio vs S&P 500 (10Y avg) vs Equal Weight portfolio
- **Story 8.6.2** — Highlight rows where Your Portfolio wins each metric
- **Story 8.6.3** — Hide this table entirely in Beginner Mode

---

## Feature 9.0 — Plain English Explanations

> A system of explanations woven throughout the entire tool — every term, chart and concept explained in plain English within one tap or hover.

### Epic 9.1 — Inline Tooltip System
- **Story 9.1.1** — Add ⓘ icon next to every financial term across the entire site
- **Story 9.1.2** — Beginner Mode: tooltip shows plain English definition and simple rule of thumb
- **Story 9.1.3** — Advanced Mode: tooltip shows technical definition with formula
- **Story 9.1.4** — Add optional fun fact to each tooltip: inventor name, year, context
- **Story 9.1.5** — Animate tooltips: fade in 150ms, fade out 100ms, never covering the element they explain

### Epic 9.2 — Contextual Explanation Cards
- **Story 9.2.1** — Show Card 1 when user adds their first stock: "Why multiple stocks?" — explains diversification
- **Story 9.2.2** — Show Card 2 when user selects a date range: "Why does the date range matter?"
- **Story 9.2.3** — Show Card 3 during optimizer loading: "What is the optimizer doing?" — explains Markowitz
- **Story 9.2.4** — Show Card 4 when results load: "What are weights?" — explains allocation in dollar terms
- **Story 9.2.5** — Make each card dismissible with an X button — dismissed cards stay gone for the session
- **Story 9.2.6** — Hide all contextual cards in Advanced Mode

### Epic 9.3 — Why This Explanation Block
- **Story 9.3.1** — Show dedicated "Why did the optimizer choose these weights?" section after results
- **Story 9.3.2** — Generate one paragraph per stock explaining its role using actual return and volatility data
- **Story 9.3.3** — Generate final paragraph summarizing how combining these stocks improved the overall Sharpe
- **Story 9.3.4** — Build explanation using template strings filled with real data — not AI generated
- **Story 9.3.5** — Hide this block in Advanced Mode

### Epic 9.4 — Glossary Page
- **Story 9.4.1** — Build /glossary page with approximately 25 financial terms used in the tool
- **Story 9.4.2** — Each term has: plain English definition, concrete example with real numbers, "See it in the tool" link
- **Story 9.4.3** — Organize terms alphabetically with section headers A B C etc.
- **Story 9.4.4** — Link to glossary from footer and from navbar in Beginner Mode

---

## Feature 10.0 — Beginner / Advanced Toggle

> A single switch in the navbar that changes how the entire tool communicates — plain English vs full mathematical detail — same data, two different experiences.

### Epic 10.1 — Toggle Switch
- **Story 10.1.1** — Add pill-shaped Beginner / Advanced toggle in top right of dashboard navbar
- **Story 10.1.2** — Default all new users to Beginner Mode
- **Story 10.1.3** — Animate mode transition: elements fade out 150ms, new elements fade in 150ms
- **Story 10.1.4** — Show toast notification on first two mode switches: "Advanced Mode enabled" / "Beginner Mode enabled"
- **Story 10.1.5** — Save toggle preference to localStorage for session persistence
- **Story 10.1.6** — Save toggle preference to Firestore so it follows the user across devices

### Epic 10.2 — Beginner Mode Behavior
- **Story 10.2.1** — Show plain English labels on all metrics throughout dashboard and results
- **Story 10.2.2** — Show all contextual explanation cards at appropriate moments
- **Story 10.2.3** — Show plain English loading messages during optimization
- **Story 10.2.4** — Show Why This explanation block after results
- **Story 10.2.5** — Hide Sharpe formula, risk-free rate breakdown and benchmark comparison table
- **Story 10.2.6** — Show Glossary link in navbar

### Epic 10.3 — Advanced Mode Behavior
- **Story 10.3.1** — Show technical labels: Expected Return μ, Volatility σ, Covariance Σ
- **Story 10.3.2** — Show technical loading messages during optimization
- **Story 10.3.3** — Show Sharpe formula with actual numbers filled in below the Sharpe card
- **Story 10.3.4** — Show benchmark comparison table below performance summary
- **Story 10.3.5** — Hide all contextual explanation cards and Why This block
- **Story 10.3.6** — Show Efficient Frontier plot, Covariance Matrix Heatmap and Raw Data Table

### Epic 10.4 — Covariance Matrix Heatmap (Advanced Only)
- **Story 10.4.1** — Render heatmap showing pairwise covariance between all selected stocks
- **Story 10.4.2** — Color scale from deep green (high correlation) to near black (low correlation)
- **Story 10.4.3** — Tooltip on each cell: covariance value, correlation value, one plain English sentence on what it means

### Epic 10.5 — Efficient Frontier Plot (Advanced Only)
- **Story 10.5.1** — Render scatter plot with risk on x-axis and return on y-axis
- **Story 10.5.2** — Plot grey dots for 500 randomly generated portfolio combinations
- **Story 10.5.3** — Draw green efficient frontier curve through optimal points
- **Story 10.5.4** — Mark optimized portfolio with gold star ★ at its exact risk/return coordinates
- **Story 10.5.5** — Plot individual stock dots labeled with tickers
- **Story 10.5.6** — Tooltip on gold star: full metrics and plain English description of what this point means

### Epic 10.6 — Raw Data Table (Advanced Only)
- **Story 10.6.1** — Show table with columns: Ticker, Expected Return, Volatility, Weight, Individual Sharpe
- **Story 10.6.2** — Include portfolio totals row at the bottom
- **Story 10.6.3** — Add "Download as CSV" button that exports the table data to a .csv file

---

## Feature 11.0 — Save Portfolio

> One-click saving of any optimized portfolio result to the user's Firestore account — turning a one-time calculator into a personal portfolio workspace.

### Epic 11.1 — Save Button and Name Input
- **Story 11.1.1** — Show save section below performance summary with name input and Save Portfolio button
- **Story 11.1.2** — Pre-fill name field with auto-generated name: "AAPL · MSFT · TSLA — Apr 2025"
- **Story 11.1.3** — Allow user to edit name up to 50 characters with live character counter
- **Story 11.1.4** — Show "Try Different Stocks" secondary button that resets the form back to Step 1

### Epic 11.2 — Firestore Save
- **Story 11.2.1** — Save complete portfolio snapshot to Firestore: name, tickers, date range, weights, performance metrics, individual stock stats, investment amount, mode, timestamp
- **Story 11.2.2** — Use unique portfolioId for each saved portfolio
- **Story 11.2.3** — Link saved portfolio to user via Firebase UID

### Epic 11.3 — Save Confirmation
- **Story 11.3.1** — Show green toast on successful save: "Portfolio Saved ✅ — View in History →"
- **Story 11.3.2** — Make "View in History →" inside toast clickable — navigates to History tab
- **Story 11.3.3** — Show red toast on save failure with Retry button
- **Story 11.3.4** — Dismiss toast automatically after 4 seconds

### Epic 11.4 — Duplicate Detection
- **Story 11.4.1** — Check Firestore before saving if same tickers and date range already saved
- **Story 11.4.2** — If duplicate found: show modal with options: Save Anyway / Update Existing / Cancel
- **Story 11.4.3** — Update Existing overwrites the matched portfolio in Firestore

### Epic 11.5 — Save Limit
- **Story 11.5.1** — Enforce maximum of 10 saved portfolios per free account
- **Story 11.5.2** — Show soft warning at 8 portfolios: "2 save slots remaining"
- **Story 11.5.3** — Show blocking message at 10 portfolios directing user to delete from History

### Epic 11.6 — Keyboard Shortcut
- **Story 11.6.1** — Implement Ctrl+S / Cmd+S shortcut to trigger save on results page
- **Story 11.6.2** — Show "Tip: Press Ctrl+S to save quickly" hint once on first results load
- **Story 11.6.3** — Dismiss the shortcut hint permanently after it has been shown once

---

## Feature 12.0 — Portfolio History

> A dedicated tab showing all saved portfolios as cards — open, rename, delete or compare any two side by side.

### Epic 12.1 — History Tab Navigation
- **Story 12.1.1** — Add History tab to main dashboard navigation alongside Optimizer tab
- **Story 12.1.2** — Show badge on History tab with count of saved portfolios
- **Story 12.1.3** — Update badge count in real time when portfolios are saved or deleted
- **Story 12.1.4** — Animate page transition: content slides in from right on tab switch

### Epic 12.2 — Portfolio Cards List
- **Story 12.2.1** — Display saved portfolios as vertical list of cards sorted newest first by default
- **Story 12.2.2** — Each card shows: portfolio name, date saved, ticker list, date range used, Return / Risk / Sharpe with verdict badges, Open button, Delete button
- **Story 12.2.3** — Apply thin left border in verdict color: green for Strong, yellow for Moderate, red for Weak

### Epic 12.3 — Opening a Saved Portfolio
- **Story 12.3.1** — Load saved portfolio results instantly from Firestore on Open click — no API call needed
- **Story 12.3.2** — Restore charts, metrics, stock chips, date range and investment amount to saved values
- **Story 12.3.3** — Show banner: "Viewing saved portfolio: [name] — Saved on [date]"
- **Story 12.3.4** — Add "Re-run with Today's Data" button in banner that triggers fresh FastAPI optimization
- **Story 12.3.5** — After re-run prompt user to save as new portfolio or overwrite existing
- **Story 12.3.6** — Add inline Rename functionality: click Rename → edit field appears → Enter to confirm → updates in Firestore and card simultaneously

### Epic 12.4 — Delete Portfolio
- **Story 12.4.1** — Show custom confirmation modal on Delete click — not browser alert
- **Story 12.4.2** — Default focused button is Cancel — pressing Enter cancels to prevent accidents
- **Story 12.4.3** — Style Delete Permanently button in red to signal destructive action
- **Story 12.4.4** — Animate deleted card sliding up and fading out on successful delete
- **Story 12.4.5** — Decrement history tab badge count immediately on delete
- **Story 12.4.6** — Show red toast with Retry button on delete failure

### Epic 12.5 — Empty State
- **Story 12.5.1** — Show empty state illustration and message when no portfolios are saved
- **Story 12.5.2** — Include "Go to Optimizer" CTA button in empty state

### Epic 12.6 — Sorting and Filtering
- **Story 12.6.1** — Add sort control: Date Saved ↓ / Date Saved ↑ / Sharpe Ratio ↓ / Return ↓
- **Story 12.6.2** — Add filter control: All / Strong (Sharpe > 1.0) / Moderate / Weak
- **Story 12.6.3** — Animate cards sliding to new positions when sort or filter changes — no reload

### Epic 12.7 — Comparison Mode
- **Story 12.7.1** — Add "Compare Portfolios" toggle button above card list
- **Story 12.7.2** — Show checkboxes on cards in comparison mode — allow selecting exactly 2
- **Story 12.7.3** — Show Compare button at bottom when 2 portfolios selected
- **Story 12.7.4** — Render side-by-side comparison view with metrics, pie charts and winner indicators
- **Story 12.7.5** — Auto-generate plain English comparison verdict: which portfolio is better and why

### Epic 12.8 — Firestore Data Loading
- **Story 12.8.1** — Fetch all user portfolios from Firestore in single query on history page mount
- **Story 12.8.2** — Show skeleton card shimmer animation while data loads
- **Story 12.8.3** — Fade in real cards replacing skeletons as data arrives

---

## Feature 13.0 — Responsive Design

> Every page and feature works perfectly on any screen — from iPhone SE to 27" monitor. Layout adapts intelligently, not just shrinks.

### Epic 13.1 — Breakpoint System
- **Story 13.1.1** — Define five breakpoints: Mobile Small (320-480px), Mobile Large (481-767px), Tablet (768-1023px), Desktop (1024-1439px), Wide Desktop (1440px+)
- **Story 13.1.2** — Apply Tailwind responsive prefixes consistently across all components

### Epic 13.2 — Navbar Responsive Behavior
- **Story 13.2.1** — Collapse navbar to hamburger menu icon on mobile
- **Story 13.2.2** — Slide down full-width mobile menu on hamburger tap with smooth animation
- **Story 13.2.3** — Include Beginner/Advanced toggle inside mobile menu
- **Story 13.2.4** — Close mobile menu on tap outside or on ✕ button

### Epic 13.3 — Landing Page Responsive Behavior
- **Story 13.3.1** — Concept cards: 3 columns desktop / 2 columns tablet / 1 column mobile
- **Story 13.3.2** — Scale hero headline from 64px desktop to 32px mobile using CSS clamp
- **Story 13.3.3** — Make CTA button full width on mobile for easy tapping
- **Story 13.3.4** — Change How It Works horizontal arrow flow to vertical on mobile

### Epic 13.4 — Dashboard Steps Responsive Behavior
- **Story 13.4.1** — Stock preview cards: 3 per row desktop / 1 per row full width mobile
- **Story 13.4.2** — Stock chips wrap to multiple lines on small screens without overflowing
- **Story 13.4.3** — Date preset buttons: side by side desktop / stacked full width mobile
- **Story 13.4.4** — Optimize button always full width on mobile
- **Story 13.4.5** — Date pickers stack vertically on mobile with labels above fields

### Epic 13.5 — Charts Responsive Behavior
- **Story 13.5.1** — Pie chart reduces to 280px diameter on mobile with legend moved below chart
- **Story 13.5.2** — Bar chart scrolls horizontally on mobile when more than 4 stocks — shows swipe hint on first view
- **Story 13.5.3** — Efficient frontier hides Monte Carlo dots on mobile for performance — shows curve and key points only
- **Story 13.5.4** — Charts render only when scrolled into view — not all on page load

### Epic 13.6 — Performance Summary Cards Responsive Behavior
- **Story 13.6.1** — Three metric cards side by side on desktop and tablet
- **Story 13.6.2** — Metric cards become horizontal full-width rows on mobile: label left, number and badge right
- **Story 13.6.3** — Number counter animation triggers on scroll into view on mobile

### Epic 13.7 — History Page Responsive Behavior
- **Story 13.7.1** — Portfolio cards show compact single-row layout on desktop, stacked layout on mobile
- **Story 13.7.2** — Comparison view: side by side on desktop / stacked vertically on mobile
- **Story 13.7.3** — Swipe left on history card to reveal Delete button on mobile (iOS pattern)

### Epic 13.8 — Touch Interactions
- **Story 13.8.1** — Enforce minimum 48px height on all buttons and 44×44px on all icon tap targets
- **Story 13.8.2** — Make entire history card tappable as Open action — not just the Open button
- **Story 13.8.3** — Tooltips open on tap and close on tap elsewhere — never on hover on mobile
- **Story 13.8.4** — Tooltips always positioned above trigger element on mobile to avoid being cut off
- **Story 13.8.5** — Disable pinch-to-zoom on charts to prevent accidental zoom during chart interaction

### Epic 13.9 — Typography Responsive Scaling
- **Story 13.9.1** — Apply CSS clamp to hero headline: clamp(28px, 5vw, 64px)
- **Story 13.9.2** — Apply CSS clamp to section headings: clamp(20px, 3vw, 36px)
- **Story 13.9.3** — Apply CSS clamp to body text: clamp(14px, 1.5vw, 16px)
- **Story 13.9.4** — Apply CSS clamp to metric card numbers: clamp(28px, 4vw, 48px)
- **Story 13.9.5** — Keep monospace font consistent across all breakpoints — only size scales

### Epic 13.10 — Mobile Performance
- **Story 13.10.1** — Use SVG for all icons — no image assets over 50KB anywhere on the site
- **Story 13.10.2** — Reduce Monte Carlo dots from 500 to 100 on mobile for faster chart rendering
- **Story 13.10.3** — Use Next.js code splitting so History page code only loads when History tab is opened
- **Story 13.10.4** — Lazy load Advanced Mode components — covariance heatmap and efficient frontier only load when Advanced Mode is toggled on

---

## 📊 Project Summary

| Category | Count |
|---|---|
| Total Features | 13 |
| Total Epics | 46 |
| Total Stories | 161 |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Auth | Firebase Authentication |
| Database | Firestore |
| Charts | Recharts |
| Backend | Python FastAPI |
| Optimization | pypfopt |
| Market Data | yfinance |
| Frontend Deploy | Vercel |
| Backend Deploy | Railway |

---

## 🚀 Getting Started

### Frontend (Next.js)
```bash
git clone <your-repository-url>
cd Portfolio-Optimization-Tool
npm install
cp .env.example .env.local  # Windows PowerShell: Copy-Item .env.example .env.local
# Add your Firebase config and API URL to .env.local
npm run dev
```

### Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
cp .env.example .env
pip install -r requirements.txt
uvicorn main:app --reload
```

### Deployment Targets

- Frontend: Vercel (`vercel.json` at repo root)
- Backend: Railway (`railway.json` at repo root, `backend/Procfile` for process command)

---

## 📁 Project Structure

```
portfolioiq/
├── app/                    # Next.js App Router pages
│   ├── api/stocks/search   # FMP search proxy route
│   ├── page.tsx            # Landing page
│   ├── login/page.tsx      # Login page
│   ├── signup/page.tsx     # Sign up page
│   ├── dashboard/page.tsx  # Main dashboard
│   ├── history/page.tsx    # Portfolio history
│   └── glossary/page.tsx   # Glossary page
├── components/             # Reusable React components
│   ├── auth/               # Auth forms and providers
│   ├── dashboard/          # Dashboard step components
│   ├── charts/             # Pie, Bar, Frontier charts
│   ├── results/            # Performance summary cards
│   └── ui/                 # Shared UI: shell, mode toggle
├── hooks/                  # Auth and mode hooks
├── lib/                    # Firebase config, API calls, utilities
├── backend/                # FastAPI Python backend
│   ├── main.py             # FastAPI app and /optimize endpoint
│   ├── app/                # Schemas, optimizer and market-data logic
│   └── requirements.txt    # Python dependencies
├── PROJECT_MEMORY.md       # House-building memory and decisions log
└── public/                 # Static assets
```

---

## 👤 Author

**Minhal** — Computational Finance Student @ NED University '27
Freelance AI & Web Dev — [Minhal's Studio](https://github.com/Minicoder0)
Fiverr: mohdminhal · GitHub: Minicoder0

---

*Built as a portfolio project demonstrating full-stack development, financial algorithm integration and beginner-first UX design.*
