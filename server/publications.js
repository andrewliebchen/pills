Meteor.publish(null, () => {
  return Meteor.roles.find({});
});

Meteor.publish('medications', () => {
  return Medications.find();
});

Meteor.publish('singleMedication', (id) => {
  return Medications.find({_id: id});
});
