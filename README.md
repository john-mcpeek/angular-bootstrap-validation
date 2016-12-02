# angular-bootstrap-validation
This is based on the excellent work of <a href="https://github.com/paulyoder/angular-bootstrap-show-errors">Paul Yoder</a>. I added some changes to use Bootstrap tooltips for error messages and to get feedback (aka "has-feedback" check and X's) into the mix.

The "error-message" tag contains the message for a particular validator. So, in this example "required" and "minlength" will show with those messages and no special effort is needed.

Representative example:
```
<style type="text/css">
	error-message {
		display: none;
	}
	
	.form-group .tooltip.top .tooltip-arrow {
		border-top-color: #a94442;
	}

	.form-group .tooltip-inner {
		background-color: #a94442;
	}

	.form-group .tooltip-arrow {
	}

	.has-success .form-control {
	  border-left-width: 6px;
	}

	.has-success .input-group .form-control {
	  border-left-width: 1px;
	}

	.has-error .form-control {
	  border-left-width: 6px;
	}

	.has-error .input-group .form-control {
	  border-left-width: 1px;
	}
</style>
```

```
<div class="form-group" show-errors>
   <label class="control-label" for="firstName">First Name</label>
   <input id="firstName" name="firstName" class="form-control" ng-model="user.firstName" required ng-minlength="4">
   <span class="glyphicon form-control-feedback" aria-hidden="true"></span>
   <error-message name="required">First Name is required.</error-message>
   <error-message name="minlength">First Name must be at least 4 characters long.</error-message>
</div>
```
