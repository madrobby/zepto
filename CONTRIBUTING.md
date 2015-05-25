## Contributing to Zepto

**Thanks for helping out!**

In order for your code to make it in, several conditions must be met:

* It's more likely your pull request will make it in if you adhere to **Zepto's
  project goals**. Be sure to read the README in its entirety before setting out
  to code.
* Please talk to the maintainers (@madrobby and @mislav) first if you want
  to write a plugin, those are better kept in their own repositories.
* Fix only ONE thing or have only ONE feature in your pull request. 
  If you have multiple unrelated code updates, please submit a separate pull request for each one.
* **Your pull request must be written in English and be accompanied by a
  detailed description**, ideally something we can use as documentation.
  If you're not fluent in English, try your best and let us know so we'll help!
* Changes to jQuery-based API methods **must match their jQuery counterparts**.
* Please **do not just copy code from jQuery**. Zepto strives for API compatibility,
  but has different goals for code style and size and target platforms.
  In case you do copy code, you must clearly indicate the origin of the code, and
  which license applies to it. However, it is likely your patch will be denied.
* **All code must have tests, and all tests must pass.** See the README on running the test suite.
* Please **also test manually** on as many target platforms you have access to,
  but at least on latest Chrome (desktop) and Firefox (desktop).
  See http://zeptojs.com for a full list of platforms.
* It's required that you follow Zepto's **code style guidelines** (see below)

Whew, now that we have that out of the way thanks again!

## Code style guidelines

* Two spaces "soft tabs" indentation
* Remove any trailing whitespace from the end of lines
* `function name() { }` for named functions
* `function(){ }` for anonymous functions
* No curly braces for single-line control flow statements such as `if` & friends
* Don't write [semicolons that are optional][optional]
* Put a single semicolon _before_ statements that start with `(` or `[`
  (see above article as for why it's needed)
* Use long, descriptive variable and method names
* Use blank lines to separate "paragraphs" of code for readability
* Use comments to describe non-obvious code behavior


  [optional]: http://mislav.uniqpath.com/2010/05/semicolons/
