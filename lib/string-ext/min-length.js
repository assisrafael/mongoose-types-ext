module.exports = function(mongoose) {
	var SchemaString = mongoose.SchemaTypes.String,
		errorMessages = mongoose.Error.messages;

	/**
	* Sets a minlength string validator.
	*
	* ####Example:
	*
	*     var s = new Schema({ n: { type: String, minlength: 4 })
	*     var M = db.model('M', s)
	*     var m = new M({ n: 'teste' })
	*     m.save(function (err) {
	*       console.error(err) // validator error
	*       m.n = 'test;
	*       m.save() // success
	*     })
	*
	*     // custom error messages
	*     // We can also use the special {MIN_LENGTH} token which will be replaced with the invalid value
	*     var max = [4, 'The length of path `{PATH}` ({VALUE}) is beneath the limit ({MIN_LENGTH}).'];
	*     var schema = new Schema({ n: { type: String, minlength: max })
	*     var M = mongoose.model('Measurement', schema);
	*     var s= new M({ n: 'teste' });
	*     s.validate(function (err) {
	*       console.log(String(err)) // ValidationError: The length of path `n` (5) is beneath the limit (4).
	*     })
	*
	* @param {Number} max length value
	* @param {String} [message] optional custom error message
	* @return {SchemaType} this
	* @see Customized Error Messages #error_messages_MongooseError-messages
	* @api public
	*/

	SchemaString.prototype.minlength = function(value, message) {
		if (this.minlengthValidator) {
			this.validators = this.validators.filter(function (v) {
				return v[0] !== this.minlengthValidator;
			}, this);
		}

		if (null !== value) {
			var msg = message || errorMessages.String.minlength;
			msg = msg.replace(/{MIN_LENGTH}/, value);
			this.validators.push([this.minlengthValidator = function (v) {
				return v === undefined || v === null || v.length >= value;
			}, msg, 'minlength']);
		}

		return this;
	};

	errorMessages.String.minlength = 'Path `{PATH}` ({VALUE}) exceeds the minimum allowed length ({MIN_LENGTH}).';
};