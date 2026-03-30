define(function(require) {
	var $ = require('jquery'),
		monster = require('monster');

	var app = {
		requests: {},

		subscribe: {
			'callflows.fetchActions': 'set_cidDefineActions'
		},

		set_cidDefineActions: function(args) {
			var self = this,
				callflow_nodes = args.actions,
				i18n = self.i18n.active().callflows.set_cid;

			$.extend(callflow_nodes, {
				'set_cid[]': {
					name: i18n.set_cid,
					icon: 'check',
					category: self.i18n.active().oldCallflows.caller_id_cat,
					module: 'set_cid',
					tip: i18n.tooltip,
					data: {
					},
					rules: [
						{
							type: 'quantity',
							maxSize: '9999'
						}
					],
					isUsable: 'true',
					weight: 48,
					caption: function(node, caption_map) {
						return node.getMetadata('caller_id_number') || '';
					},
					edit: function(node, callback) {
						self.set_cidShowEditDialog(node, callback);
					}
				}
			});
		},

		set_cidShowEditDialog: function (node, callback) {
			var self = this,
				$popup,
				$dialog,
				i18n = self.i18n.active().callflows.set_cid,
				caller_id_name = node.getMetadata('caller_id_name') || '',
				caller_id_number = node.getMetadata('caller_id_number') || '',

			$dialog = $(self.getTemplate({
				name: 'dialogEdit',
				data: {
					caller_id_name: caller_id_name,
					caller_id_number: caller_id_number,
				},
				submodule: 'set_cid'
			}));

			$popup = monster.ui.dialog($dialog, {
				title: self.i18n.active().callflows.set_cid.edit_dialog.title,
				minHeight: '0',
				width: 450,
				beforeClose: function() {
					if (typeof callback === 'function') {
						callback();
					}
				}
			});

			monster.ui.tooltips($dialog);

			$dialog.find('.js-save').click(function() {
				var $form = $(this)
					.closest('.js-set-cid-dialog')
					.find('.js-set-cid-form');
				var formData = monster.ui.getFormData($form[0]);

				node.deleteMetadata('caller_id_name');
				node.deleteMetadata('caller_id_number');

				formData.caller_id_name && node.setMetadata('caller_id_name', formData.caller_id_name);
				formData.caller_id_number && node.setMetadata('caller_id_number', formData.caller_id_number);
				node.caption = formData.caller_id_number || '';

				if (typeof callback === 'function') {
					callback();
				}

				$popup.dialog('close');
			});
		}
	};

	return app;
});
