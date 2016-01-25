// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * SearchBox Plugin
 *
 * Adds basic demonstration functionality to .ms-SearchBox components.
 *
 * @param  {jQuery Object}  One or more .ms-SearchBox components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
    $.fn.SearchBox = function () {

        /** Iterate through each text field provided. */
        return this.each(function () {
            // Set cancel to false
            var cancel = false;

            /** SearchBox focus - hide label and show cancel button */
            $(this).find('.ms-SearchBox-field').on('focus', function () {
                /** Hide the label on focus. */
                $(this).siblings('.ms-SearchBox-label').hide();
                // Show cancel button by adding is-active class
                $(this).parent('.ms-SearchBox').addClass('is-active');
            });


            // If cancel button is selected, change cancel value to true
            $(this).find('.ms-SearchBox-closeButton').on('mousedown', function () {
                cancel = true;
            });

            /** Show the label again when leaving the field. */
            $(this).find('.ms-SearchBox-field').on('blur', function () {

                // If cancel button is selected remove the text and show the label
                if (cancel == true) {
                    $(this).val('');
                    $(this).siblings('.ms-SearchBox-label').show();
                }

                // Remove is-active class - hides cancel button
                $(this).parent('.ms-SearchBox').removeClass('is-active');

                /** Only do this if no text was entered. */
                if ($(this).val().length === 0) {
                    $(this).siblings('.ms-SearchBox-label').show();
                }

                // Reset cancel to false
                cancel = false;
            });


        });

    };
})(jQuery);



// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * List Item Plugin
 *
 * Adds basic demonstration functionality to .ms-ListItem components.
 *
 * @param  {jQuery Object}  One or more .ms-ListItem components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
    $.fn.ListItem = function () {

        /** Go through each panel we've been given. */
        return this.each(function () {

            var $listItem = $(this);

            /** Detect clicks on selectable list items. */
            $listItem.on('click', '.js-toggleSelection', function (event) {
                $(this).parents('.ms-ListItem').toggleClass('is-selected');
            });

        });

    };
})(jQuery);


// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Nav Bar Plugin
 */
(function ($) {
    $.fn.NavBar = function () {

        /** Go through each nav bar we've been given. */
        return this.each(function () {

            var $navBar = $(this);

            // Open the nav bar on mobile.
            $navBar.on('click', '.js-openMenu', function (event) {
                event.stopPropagation();
                $navBar.toggleClass('is-open');
            });

            // Close the nav bar on mobile.
            $navBar.click(function () {
                if ($navBar.hasClass('is-open')) {
                    $navBar.removeClass('is-open');
                }
            });

            // Set selected states and open/close menus.
            $navBar.on('click', '.ms-NavBar-item:not(.is-disabled)', function (event) {
                var $searchBox = $navBar.find('.ms-NavBar-item.ms-NavBar-item--search .ms-TextField-field');
                event.stopPropagation();

                // Prevent default actions from firing if links are not found.
                if ($(this).children('.ms-NavBar-link').length === 0) {
                    event.preventDefault();
                }

                // Deselect all of the items.
                $(this).siblings('.ms-NavBar-item').removeClass('is-selected');

                // Close and blur the search box if it doesn't have text.
                if ($searchBox.length > 0 && $searchBox.val().length === 0) {
                    $('.ms-NavBar-item.ms-NavBar-item--search').removeClass('is-open').find('.ms-TextField-field').blur();
                }

                // Does the selected item have a menu?
                if ($(this).hasClass('ms-NavBar-item--hasMenu')) {

                    // Toggle 'is-open' to open or close it.
                    $(this).children('.ms-ContextualMenu:first').toggleClass('is-open');

                    // Toggle 'is-selected' to indicate whether it is active.
                    $(this).toggleClass('is-selected');
                } else {
                    // Doesn't have a menu, so just select the item.
                    $(this).addClass('is-selected');

                    // Close the submenu and any open contextual menus.
                    $navBar.removeClass('is-open').find('.ms-ContextualMenu').removeClass('is-open');
                }

                // Is this the search box? Open it up and focus on the search field.
                if ($(this).hasClass('ms-NavBar-item--search')) {
                    $(this).addClass('is-open');
                    $(this).find('.ms-TextField-field').focus();

                    // Close any open menus.
                    $navBar.find('.ms-ContextualMenu:first').removeClass('is-open');
                }
            });

            // Prevent contextual menus from being hidden when clicking on them.
            $navBar.on('click', '.ms-NavBar-item .ms-ContextualMenu', function (event) {
                event.stopPropagation();

                // Collapse the mobile "panel" for nav items.
                $(this).removeClass('is-open');
                $navBar.removeClass('is-open').find('.ms-NavBar-item--hasMenu').removeClass('is-selected');
            });

            // Hide any menus and close the search box when clicking anywhere in the document.
            $(document).on('click', 'html', function (event) {
                var $searchBox = $navBar.find('.ms-NavBar-item.ms-NavBar-item--search .ms-TextField-field');
                $navBar.find('.ms-NavBar-item').removeClass('is-selected').find('.ms-ContextualMenu').removeClass('is-open');

                // Close and blur the search box if it doesn't have text.
                if ($searchBox.length > 0 && $searchBox.val().length === 0) {
                    $navBar.find('.ms-NavBar-item.ms-NavBar-item--search').removeClass('is-open').find('.ms-TextField-field').blur();
                }
            });
        });
    };
})(jQuery);
// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Pivot Plugin
 *
 * Adds basic demonstration functionality to .ms-Pivot components.
 *
 * @param  {jQuery Object}  One or more .ms-Pivot components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
    $.fn.Pivot = function () {

        /** Go through each pivot we've been given. */
        return this.each(function () {

            var $pivotContainer = $(this);

            /** When clicking/tapping a link, select it. */
            $pivotContainer.on('click', '.ms-Pivot-link', function (event) {
                event.preventDefault();
                $(this).siblings('.ms-Pivot-link').removeClass('is-selected');
                $(this).addClass('is-selected');
            });

        });

    };
})(jQuery);
