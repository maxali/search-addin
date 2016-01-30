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


// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Text Field Plugin
 *
 * Adds basic demonstration functionality to .ms-TextField components.
 *
 * @param  {jQuery Object}  One or more .ms-TextField components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
    $.fn.TextField = function () {

        /** Iterate through each text field provided. */
        return this.each(function () {

            /** Does it have a placeholder? */
            if ($(this).hasClass("ms-TextField--placeholder")) {

                /** Hide the label on click. */
                $(this).on('click', function () {
                    $(this).find('.ms-Label').hide();
                });

                /** Show the label again when leaving the field. */
                $(this).find('.ms-TextField-field').on('blur', function () {

                    /** Only do this if no text was entered. */
                    if ($(this).val().length === 0) {
                        $(this).siblings('.ms-Label').show();
                    }
                });
            };

            /** Underlined - adding/removing a focus class */
            if ($(this).hasClass('ms-TextField--underlined')) {

                /** Add is-active class - changes border color to theme primary */
                $(this).find('.ms-TextField-field').on('focus', function () {
                    $(this).parent('.ms-TextField--underlined').addClass('is-active');
                });

                /** Remove is-active on blur of textfield */
                $(this).find('.ms-TextField-field').on('blur', function () {
                    $(this).parent('.ms-TextField--underlined').removeClass('is-active');
                });
            };

        });
    };
})(jQuery);


// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Dropdown Plugin
 * 
 * Given .ms-Dropdown containers with generic <select> elements inside, this plugin hides the original
 * dropdown and creates a new "fake" dropdown that can more easily be styled across browsers.
 * 
 * @param  {jQuery Object}  One or more .ms-Dropdown containers, each with a dropdown (.ms-Dropdown-select)
 * @return {jQuery Object}  The same containers (allows for chaining)
 */
(function ($) {
    $.fn.Dropdown = function () {

        /** Go through each dropdown we've been given. */
        return this.each(function () {

            var $dropdownWrapper = $(this),
                $originalDropdown = $dropdownWrapper.children('.ms-Dropdown-select'),
                $originalDropdownOptions = $originalDropdown.children('option'),
                originalDropdownID = this.id,
                newDropdownTitle = '',
                newDropdownItems = '',
                newDropdownSource = '';

            /** Go through the options to fill up newDropdownTitle and newDropdownItems. */
            $originalDropdownOptions.each(function (index, option) {

                /** If the option is selected, it should be the new dropdown's title. */
                if (option.selected) {
                    newDropdownTitle = option.text;
                }

                /** Add this option to the list of items. */
                newDropdownItems += '<li class="ms-Dropdown-item' + ((option.disabled) ? ' is-disabled"' : '"') + '>' + option.text + '</li>';

            });

            /** Insert the replacement dropdown. */
            newDropdownSource = '<span class="ms-Dropdown-title">' + newDropdownTitle + '</span><ul class="ms-Dropdown-items">' + newDropdownItems + '</ul>';
            $dropdownWrapper.append(newDropdownSource);

            function _openDropdown(evt) {
                if (!$dropdownWrapper.hasClass('is-disabled')) {

                    /** First, let's close any open dropdowns on this page. */
                    $dropdownWrapper.find('.is-open').removeClass('is-open');

                    /** Stop the click event from propagating, which would just close the dropdown immediately. */
                    evt.stopPropagation();

                    /** Before opening, size the items list to match the dropdown. */
                    var dropdownWidth = $(this).parents(".ms-Dropdown").width();
                    $(this).next(".ms-Dropdown-items").css('width', dropdownWidth + 'px');

                    /** Go ahead and open that dropdown. */
                    $dropdownWrapper.toggleClass('is-open');
                    $('.ms-Dropdown').each(function () {
                        if ($(this)[0] !== $dropdownWrapper[0]) {
                            $(this).removeClass('is-open');
                        }
                    });

                    /** Temporarily bind an event to the document that will close this dropdown when clicking anywhere. */
                    $(document).bind("click.dropdown", function (event) {
                        $dropdownWrapper.removeClass('is-open');
                        $(document).unbind('click.dropdown');
                    });
                }
            };

            /** Toggle open/closed state of the dropdown when clicking its title. */
            $dropdownWrapper.on('click', '.ms-Dropdown-title', function (event) {
                _openDropdown(event);
            });

            /** Keyboard accessibility */
            $dropdownWrapper.on('keyup', function (event) {
                var keyCode = event.keyCode || event.which;
                // Open dropdown on enter or arrow up or arrow down and focus on first option
                if (!$(this).hasClass('is-open')) {
                    if (keyCode === 13 || keyCode === 38 || keyCode === 40) {
                        _openDropdown(event);
                        if (!$(this).find('.ms-Dropdown-item').hasClass('is-selected')) {
                            $(this).find('.ms-Dropdown-item:first').addClass('is-selected');
                        }
                    }
                }
                else if ($(this).hasClass('is-open')) {
                    // Up arrow focuses previous option
                    if (keyCode === 38) {
                        if ($(this).find('.ms-Dropdown-item.is-selected').prev().siblings().size() > 0) {
                            $(this).find('.ms-Dropdown-item.is-selected').removeClass('is-selected').prev().addClass('is-selected');
                        }
                    }
                    // Down arrow focuses next option
                    if (keyCode === 40) {
                        if ($(this).find('.ms-Dropdown-item.is-selected').next().siblings().size() > 0) {
                            $(this).find('.ms-Dropdown-item.is-selected').removeClass('is-selected').next().addClass('is-selected');
                        }
                    }
                    // Enter to select item
                    if (keyCode === 13) {
                        if (!$dropdownWrapper.hasClass('is-disabled')) {

                            // Item text
                            var selectedItemText = $(this).find('.ms-Dropdown-item.is-selected').text()

                            $(this).find('.ms-Dropdown-title').html(selectedItemText);

                            /** Update the original dropdown. */
                            $originalDropdown.find("option").each(function (key, value) {
                                if (value.text === selectedItemText) {
                                    $(this).prop('selected', true);
                                } else {
                                    $(this).prop('selected', false);
                                }
                            });
                            $originalDropdown.change();

                            $(this).removeClass('is-open');
                        }
                    }
                }

                // Close dropdown on esc
                if (keyCode === 27) {
                    $(this).removeClass('is-open');
                }
            });

            /** Select an option from the dropdown. */
            $dropdownWrapper.on('click', '.ms-Dropdown-item', function () {
                if (!$dropdownWrapper.hasClass('is-disabled')) {

                    /** Deselect all items and select this one. */
                    $(this).siblings('.ms-Dropdown-item').removeClass('is-selected')
                    $(this).addClass('is-selected');

                    /** Update the replacement dropdown's title. */
                    $(this).parents().siblings('.ms-Dropdown-title').html($(this).text());

                    /** Update the original dropdown. */
                    var selectedItemText = $(this).text();
                    $originalDropdown.find("option").each(function (key, value) {
                        if (value.text === selectedItemText) {
                            $(this).prop('selected', true);
                        } else {
                            $(this).prop('selected', false);
                        }
                    });
                    $originalDropdown.change();
                }
            });

        });
    };
})(jQuery);