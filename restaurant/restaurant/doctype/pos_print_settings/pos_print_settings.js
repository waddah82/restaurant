

frappe.ui.form.on('Follow Up', {
  onload: function(frm) {
    // set default dates/times where applicable
    if (frm.doc && !frm.doc.__islocal) return;
    if (frm.fields_dict && frm.set_value) {
      if (frm.doc && !frm.doc.name) {
        if (frm.fields_dict['meeting_date']) frm.set_value('meeting_date', frappe.datetime.get_today());
        if (frm.fields_dict['correspondence_date']) frm.set_value('correspondence_date', frappe.datetime.get_today());
        if (frm.fields_dict['memo_date']) frm.set_value('memo_date', frappe.datetime.get_today());
        if (frm.fields_dict['minutes_date']) frm.set_value('minutes_date', frappe.datetime.get_today());
      }
    }
  },
  refresh: function(frm) {
    // hide form if archived
    if (frm.doc && frm.doc.status == 'Archived') { frm.disable_form(); }
  }
});