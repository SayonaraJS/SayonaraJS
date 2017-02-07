(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["quill"], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require("quill"));
    } else {
        root.Requester = factory(root.Quill);
    }
}(this, function (Quill) {

    'use strict';

    var app;
    // declare ngQuill module
    app = angular.module('ngQuill', []);

    app.provider('ngQuillConfig', function () {
        var config = {
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    ['blockquote', 'code-block'],

                    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                    [{ 'direction': 'rtl' }],                         // text direction

                    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                    [{ 'font': [] }],
                    [{ 'align': [] }],

                    ['clean'],                                         // remove formatting button

                    ['link', 'image', 'video']                         // link and image, video
                ]
            },
            theme: 'snow',
            placeholder: 'Insert text here ...',
            readOnly: false,
            boundary: document.body
        };

        this.set = function (modules, theme, placeholder, formats, boundary, readOnly) {
            if (modules) {
                config.modules = modules;
            }
            if (theme) {
                config.theme = theme;
            }
            if (placeholder) {
                config.placeholder = placeholder;
            }
            if (boundary) {
                config.boundary = boundary;
            }
            if (readOnly) {
                config.readOnly = readOnly;
            }
            if (formats) {
                config.formats = formats;
            }
        };

        this.$get = function () {
            return config;
        };
    });

    app.component('ngQuillEditor', {
        bindings: {
            'modules': '<modules',
            'theme': '@?',
            'readOnly': '<?',
            'formats': '<?',
            'placeholder': '@?',
            'onEditorCreated': '&?',
            'onContentChanged': '&?',
            'ngModel': '<',
            'maxLength': '<',
            'minLength': '<'
        },
        require: {
            ngModelCtrl: 'ngModel'
        },
        template: '<div></div>',
        controller: ['$scope', '$element', 'ngQuillConfig', function ($scope, $element, ngQuillConfig) {
            var config = {},
                content,
                editorElem,
                modelChanged = false,
                editorChanged = false,
                editor;

            this.validate = function (text) {
                if (this.maxLength) {
                    if (text.length > this.maxLength + 1) {
                        this.ngModelCtrl.$setValidity('maxlength', false)
                    } else {
                        this.ngModelCtrl.$setValidity('maxlength', true)
                    }
                }

                if (this.minLength) {
                    if (text.length <= this.minLength) {
                        this.ngModelCtrl.$setValidity('minlength', false)
                    } else {
                        this.ngModelCtrl.$setValidity('minlength', true)
                    }
                }
            }

            this.$onChanges = function (changes) {
                if (changes.ngModel && changes.ngModel.currentValue !== changes.ngModel.previousValue) {
                    content = changes.ngModel.currentValue;

                    if (editor && !editorChanged) {
                        modelChanged = true;
                        if (content) {
                            editor.pasteHTML(content);
                            return;
                        }
                        editor.setText('');
                    }
                    editorChanged = false;
                }
                if (editor && changes.readOnly) {
                    editor.enable(!changes.readOnly.currentValue);
                }
            };

            this.$onInit = function () {
                 config = {
                    theme: this.theme || ngQuillConfig.theme,
                    readOnly: this.readOnly || ngQuillConfig.readOnly,
                    modules: this.modules || ngQuillConfig.modules,
                    formats: this.formats || ngQuillConfig.formats,
                    placeholder: this.placeholder ||  ngQuillConfig.placeholder,
                    boundary: ngQuillConfig.boundary,
                }
            };

            this.$postLink = function () {
                editorElem = $element[0].children[0];
                // init editor
                editor = new Quill(editorElem, config);

                // mark model as touched if editor lost focus
                editor.on('selection-change', function (range) {
                    if (range) {
                        return;
                    }
                    $scope.$apply(function () {
                        this.ngModelCtrl.$setTouched();
                    }.bind(this));
                }.bind(this));

                // update model if text changes
                editor.on('text-change', function () {
                    var html = editorElem.children[0].innerHTML;
                    var text = editor.getText();

                    if (html === '<p><br></p>') {
                        html = null;
                    }
                    this.validate(text);

                    if (!modelChanged) {
                        $scope.$apply(function () {
                            editorChanged = true;

                            this.ngModelCtrl.$setViewValue(html);

                            if (this.onContentChanged) {
                                this.onContentChanged({
                                    editor: editor,
                                    html: html,
                                    text: text
                                });
                            }
                        }.bind(this));
                    }
                    modelChanged = false;
                }.bind(this));

                // set initial content
                if (content) {
                    modelChanged = true;

                    editor.pasteHTML(content);
                }

                // provide event to get informed when editor is created -> pass editor object.
                if (this.onEditorCreated) {
                    this.onEditorCreated({editor: editor});
                }
            };
        }]
    });
}));

    //"build": "grunt", // && cat src/ng-quill.umd.js | uglifyjs > src/ng-quill.umd.min.js && grunt && src/
