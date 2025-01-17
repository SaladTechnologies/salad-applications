export interface GetMailchimpSubscriptionFormParams {
  name: string
  id: string
  fId: string
  groupId: string
}

export const getMailchimpSubscriptionForm = ({ id, fId, groupId, name }: GetMailchimpSubscriptionFormParams) => {
  return `<div id="mc_embed_shell">
<style type="text/css">
#mc_embed_signup{background:#fff; false;clear:left; font:14px Helvetica,Arial,sans-serif; width: 100%;}
/* Add your own Mailchimp form style overrides in your site stylesheet or in this style block.
We recommend moving this block and the preceding CSS link to the HEAD of your HTML file. /
</style>
<div id="mc_embed_signup">
<form action="https://salad.us19.list-manage.com/subscribe/post?u=dee959e4ca8934a51c2b00168&amp;id=${id}&amp;f_id=${fId}" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank">
<div id="mc_embed_signup_scroll"><h2>Subscribe</h2>
<div class="indicates-required"><span class="asterisk"></span> indicates required</div>
<div class="mc-field-group"><label for="mce-EMAIL">Email Address <span class="asterisk">*</span></label><input type="email" name="EMAIL" class="required email" id="mce-EMAIL" required="" value=""></div><div class="mc-field-group input-group"><strong>Demand Alerts </strong><ul><li><input type="checkbox" name="group[${groupId}][1]" id="mce-group[${groupId}]-${groupId}-0" value=""><label for="mce-group[${groupId}]-${groupId}-0">${name} @ High Demand</label></li><li><input type="checkbox" name="group[${groupId}][2]" id="mce-group[${groupId}]-${groupId}-1" value=""><label for="mce-group[${groupId}]-${groupId}-1">${name} @ Moderate Demand</label></li><li><input type="checkbox" name="group[${groupId}][4]" id="mce-group[${groupId}]-${groupId}-2" value=""><label for="mce-group[${groupId}]-${groupId}-2">${name} @ Low Demand</label></li></ul></div>
<div id="mce-responses" class="clear">
<div class="response" id="mce-error-response" style="display: none;"></div>
<div class="response" id="mce-success-response" style="display: none;"></div>
</div><div aria-hidden="true" style="position: absolute; left: -5000px;"><input type="text" name="b_dee959e4ca8934a51c2b00168_${id}" tabindex="-1" value=""></div><div class="clear"><input type="submit" name="subscribe" id="mc-embedded-subscribe" class="button" value="Subscribe"></div>
</div>
</form>
</div>
<script type="text/javascript" src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js"></script><script type="text/javascript">(function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]='EMAIL';ftypes[0]='email';fnames[1]='FNAME';ftypes[1]='text';fnames[2]='LNAME';ftypes[2]='text';fnames[3]='ADDRESS';ftypes[3]='address';fnames[4]='PHONE';ftypes[4]='phone';}(jQuery));var $mcj = jQuery.noConflict(true);</script></div>`
}
