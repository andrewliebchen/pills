Meteor.startup(function() {
  if(Medications.find().count() === 0) {
    Medications.insert({
      name: 'Asprin',
      dose: [4, 8, 16, 20]
    });
  }
});
