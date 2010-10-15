==============================================================================
YUI Compressor
==============================================================================

NAME

  YUI Compressor - The Yahoo! JavaScript and CSS Compressor

SYNOPSIS

  Usage: java -jar yuicompressor-x.y.z.jar [options] [input file]

  Global Options
    -h, --help                Displays this information
    --type <js|css>           Specifies the type of the input file
    --charset <charset>       Read the input file using <charset>
    --line-break <column>     Insert a line break after the specified column number
    -v, --verbose             Display informational messages and warnings
    -o <file>                 Place the output into <file>. Defaults to stdout.

  JavaScript Options
    --nomunge                 Minify only, do not obfuscate
    --preserve-semi           Preserve all semicolons
    --disable-optimizations   Disable all micro optimizations

DESCRIPTION

  The YUI Compressor is a JavaScript compressor which, in addition to removing
  comments and white-spaces, obfuscates local variables using the smallest
  possible variable name. This obfuscation is safe, even when using constructs
  such as 'eval' or 'with' (although the compression is not optimal is those
  cases) Compared to jsmin, the average savings is around 20%.

  The YUI Compressor is also able to safely compress CSS files. The decision
  on which compressor is being used is made on the file extension (js or css)

GLOBAL OPTIONS

  -h, --help
      Prints help on how to use the YUI Compressor

  --line-break
      Some source control tools don't like files containing lines longer than,
      say 8000 characters. The linebreak option is used in that case to split
      long lines after a specific column. It can also be used to make the code
      more readable, easier to debug (especially with the MS Script Debugger)
      Specify 0 to get a line break after each semi-colon in JavaScript, and
      after each rule in CSS.

  --type js|css
      The type of compressor (JavaScript or CSS) is chosen based on the
      extension of the input file name (.js or .css) This option is required
      if no input file has been specified. Otherwise, this option is only
      required if the input file extension is neither 'js' nor 'css'.

  --charset character-set
      If a supported character set is specified, the YUI Compressor will use it
      to read the input file. Otherwise, it will assume that the platform's
      default character set is being used. The output file is encoded using
      the same character set.

  -o outfile
      Place output in file outfile. If not specified, the YUI Compressor will
      default to the standard output, which you can redirect to a file.

  -v, --verbose
      Display informational messages and warnings.

JAVASCRIPT ONLY OPTIONS

  --nomunge
      Minify only. Do not obfuscate local symbols.

  --preserve-semi
      Preserve unnecessary semicolons (such as right before a '}') This option
      is useful when compressed code has to be run through JSLint (which is the
      case of YUI for example)

  --disable-optimizations
      Disable all the built-in micro optimizations.

NOTES

  + If no input file is specified, it defaults to stdin.

  + The YUI Compressor requires Java version >= 1.4.

  + It is possible to prevent a local variable, nested function or function
    argument from being obfuscated by using "hints". A hint is a string that
    is located at the very beginning of a function body like so:

    function fn (arg1, arg2, arg3) {
        "arg2:nomunge, localVar:nomunge, nestedFn:nomunge";

        ...
        var localVar;
        ...

        function nestedFn () {
            ....
        }

        ...
    }

    The hint itself disappears from the compressed file.

  + C-style comments starting with /*! are preserved. This is useful with
    comments containing copyright/license information. For example:

    /*!
     * TERMS OF USE - EASING EQUATIONS
     * Open source under the BSD License.
     * Copyright 2001 Robert Penner All rights reserved.
     */

    becomes:

    /*
     * TERMS OF USE - EASING EQUATIONS
     * Open source under the BSD License.
     * Copyright 2001 Robert Penner All rights reserved.
     */

AUTHOR

  The YUI Compressor was written and is maintained by:
      Julien Lecomte <jlecomte@yahoo-inc.com>
  The CSS portion is a port of Isaac Schlueter's cssmin utility.

COPYRIGHT

  Copyright (c) 2007-2009, Yahoo! Inc. All rights reserved.

LICENSE

  All code specific to YUI Compressor is issued under a BSD license.
  YUI Compressor extends and implements code from Mozilla's Rhino project.
  Rhino is issued under the Mozilla Public License (MPL), and MPL applies
  to the Rhino source and binaries that are distributed with YUI Compressor.