/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(["jquery"], function($) {

    "use strict";

    // the block slider is used to choose which block is currently selected

    var article = $("article");
    var blocks = article.find(".block");
    var slider, cursor;
    // current block = block at current_position of slider
    var current_position, current_block;
    var before, after; // functions

    var init = function(bef,aft) {
        before = bef; // what to do before changing of current block
        after = aft; // what to do after changing of current block
        // after takes the new block as argument

        slider = $('<div id="slider"></div>');
        // slider position
        // there may be a better way (and we don't handle resizing for now)
        slider.css("left",
            ((article.offset().right
              + $("#isso-thread").offset().left) / 2
             - 10) + "px");
        article.insertAfter(slider);

        cursor = $('<div id="cursor"></div>');
        slider.append(cursor);

        var first_block = blocks.offset();
        // this is not good if block is is higher than the window
        setTimeout(function() {
            set_cursor_position((first_block.top + first_block.bottom) / 2);
        }, 0);
    };

    // cursor position
    var set_cursor_position = function(y) {
        var slider_rect = slider.offset();
        var slider_height = slider_rect.bottom - slider_rect.top;
        var raw_position = y - slider_rect.top - 10;
        var corrected_position =
            (raw_position < 0) ?
            0 : ((raw_position > slider_height - 20) ?
                 slider_height - 20 : raw_position);
        cursor.css("top", corrected_position + "px");
        // current_position is useful to determine the current block
        current_position = y + slider_rect.top + 10;
    };

    var update_current_block = function() {
        var i = 0;
        while (i < blocks.length &&
            blocks.eq(i).offset().top <= current_position) {
            i++;
        }
        var new_block = blocks.eq(i - 1);
        if (new_block !== current_block) {
            // To do before updating block
            before();
            // To do after updating block
            current_block = new_block;
            highlight_current_block();
            after(new_block[0]);
        }
    };

    var highlight_current_block = function() {
        blocks.removeClass("current-block");
        current_block.addClass("current-block");
    };

    return {
        init: init,
        update_current_block: update_current_block
    };

});
