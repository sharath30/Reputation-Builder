
var showQuestion = function(question) {
	
	
	var result = $('.templates .question').clone();
	
	
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" '+
		'href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
		question.owner.display_name +
		'</a></p>' +
		'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};

var showInspiration = function(question){

	var result = $('.templates .question').clone();

	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.user.link);
	questionElem.text(question.tags);

	
	var asked = result.find('.asked-date');
	var rep = question.score;
	asked.text(rep);


	var viewed = result.find('.viewed');
	viewed.text(question.post_count);

	
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" '+
		'href=http://stackoverflow.com/users/' + question.user.user_id + ' >' +
		question.user.display_name +
		'</a></p>' +
		'<p>Score: ' + question.score + '</p>' +
		'<p>Reputation: ' + question.user.reputation + '</p>'
	);

	return result;
};


var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query + '</strong>';
	return results;
};

var showSearchResults2 = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query + '</strong>';
	return results;
};


var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};


var getUnanswered = function(tags) {
	
	
	var request = { 
		tagged: tags,
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'
	};
	
	$.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
	})
	.done(function(result){ 
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);
		
		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error){ 
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};


var getInspiration = function(tags) {
	var request = { 
		tagged: tags,
		site: 'stackoverflow',
		order: 'desc',
		sort: 'desc'
	};

	var murl = "http://api.stackexchange.com/2.2/tags/" + tags + "/top-answerers/all_time?"; 
	$.ajax({
		url: murl,
		data: request,
		dataType: "jsonp",
		type: "GET",	
	})

	.done(function(result){ 
		console.log(result);
		
		var searchResults = showSearchResults2(request.user, result.items.length);

		$('.search-results').html(searchResults);
		
		$.each(result.items, function(i, item) {
			
			var question = showInspiration(item, tags);
			console.log(question);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error){ 
		
	});
};


$(document).ready( function() {
	$('.unanswered-getter').submit( function(e){
		e.preventDefault();
		
		$('.results').html('');

		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

	$('.inspiration-getter').submit( function(e){
		e.preventDefault();
		
		$('.results').html('');
		
		var tags = $(this).find("input[name='tags']").val();
		getInspiration(tags);
	});
});
