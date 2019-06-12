import './input'
import './output'

import $ from 'jquery'

// Load settings
$(function () {
    if (localStorage.getItem('settings.editor.keymap') !== null) {
        $('#switch-vim-mode').click();
    }
});
