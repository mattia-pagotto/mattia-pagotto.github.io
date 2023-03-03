import * as params from "@params";

// obtain cookieconsent plugin
var cc = initCookieConsent();
const cookie = "🍪 ";
const hostname = window.location.hostname;

// run plugin with config object
cc.run({
	current_lang: "en",
	autoclear_cookies: true, // default: false
	cookie_expiration: 365, // default: 182
	page_scripts: true, // default: false

	// auto_language: null,                     // default: null; could also be 'browser' or 'document'
	// autorun: true,                           // default: true
	// delay: 0,                                // default: 0
	// hide_from_bots: false,                   // default: false
	// remove_cookie_tables: false              // default: false
	// cookie_domain: location.hostname,        // default: current domain
	// cookie_path: '/',                        // default: root
	// cookie_same_site: 'Lax',
	// use_rfc_cookie: false,                   // default: false
	// revision: 0,                             // default: 0

	gui_options: {
		consent_modal: {
			layout: "cloud", // box,cloud,bar
			position: "bottom center", // bottom,middle,top + left,right,center
			transition: "zoom", // zoom,slide
		},
		settings_modal: {
			layout: "box", // box,bar
			transition: "slide", // zoom,slide
		},
	},

	onChange: function (cookie, changed_preferences) {
		// If analytics category is disabled => disable google analytics
		if (!cc.allowedCategory("analytics")) {
			typeof gtag === "function" &&
				gtag("consent", "update", {
					analytics_storage: "denied",
				});
		}
	},

	languages: {
		en: {
			consent_modal: {
				title: cookie + params.consent_modal.title,
				description: params.consent_modal.description,
				primary_btn: {
					text: params.accept_all,
					role: "accept_all", //'accept_selected' or 'accept_all'
				},
				secondary_btn: {
					text: params.accept_only_necessary,
					role: "accept_necessary", //'settings' or 'accept_necessary'
				},
				revision_message: "<br><br>" + params.revision_message,
			},
			settings_modal: {
				title: params.settings_modal.title,
				save_settings_btn: params.settings_modal.save_settings,
				accept_all_btn: params.settings_modal.settings_accept_all,
				reject_all_btn: params.settings_modal.settings_reject_all,
				close_btn_label: "Close",
				cookie_table_headers: [
					{ col1: params.name },
					{ col2: params.domain },
					{ col3: params.expiration },
					{ col4: params.description },
				],
				blocks: [
					{
						title: params.settings_modal.cookie_usage_block.title + " 📢",
						description:
							params.settings_modal.cookie_usage_block.description,
					},
					{
						title: params.settings_modal.cookie_usage_block
							.strictly_necessary_cookies.title,
						description:
							params.settings_modal.cookie_usage_block
								.strictly_necessary_cookies.description,
						toggle: {
							value: "necessary",
							enabled: true,
							readonly: true, //cookie categories with readonly=true are all treated as "necessary cookies"
						},
					},
					{
						title: params.settings_modal.cookie_usage_block
							.performance_and_analytics_cookies.title,
						description:
							params.settings_modal.cookie_usage_block
								.performance_and_analytics_cookies.description,
						toggle: {
							value: "analytics",
							enabled: false,
							readonly: false,
							//reload: "on_disable",
						},
						cookie_table: [
							{
								col1: "^_ga",
								col2: hostname,
								col3:
									2 +
									" " +
									params.settings_modal.cookie_usage_block.years,
								col4: params.settings_modal.cookie_usage_block
									.performance_and_analytics_cookies.ga
									._ga_description,
								is_regex: true,
							},
							{
								col1: "_gid",
								col2: hostname,
								col3:
									2 +
									" " +
									params.settings_modal.cookie_usage_block.years,
								col4: params.settings_modal.cookie_usage_block
									.performance_and_analytics_cookies.ga
									._gid_description,
							},
						],
					},
					{
						title: params.settings_modal.cookie_usage_block
							.more_information.title,
						description:
							params.settings_modal.cookie_usage_block.more_information
								.description,
					},
				],
			},
		},
	},
});
