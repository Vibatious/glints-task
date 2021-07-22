## Task
1) List all restaurants that are open at a certain datetime

## API
	# Endpoint : /get-opened-resturants?dateTime=dd-mm-yy HH:MM
	# For getting the opened Resturant at particular datetime, call /get-opened-resturants?dateTime=dd-mm-yy HH:MM pass datetime query parameters with api in the format 'dd-mm-yy HH:MM'

2) List top y restaurants that have more or less than x number of dishes within a price range

## API 
	For this operation we have one endpoint with different queryParams
	-> Endpoint for fetching the y resturants having more x dishes with defined price range:
		/get-top-resturants?top=y&&greaterThan=x&&fromPrice=lower&&toPrice=higher
		(where:  y is the no of resturants to return, x lower limit on dish count, lower&higher is the lower and higher value respectively of defined range price)
	-> Endpoint  for fetching the y resturants having less than x dishes with defined price range:
		/get-top-resturants?top=y&&lessThan=x&&fromPrice=lower&&toPrice=higher
		(where:  y is the no of resturants to return, y upper limit on dish count, lower&higher is the lower and higher value respectively of defined range price)

3) Search for restaurants or dishes by name, ranked by relevance to search term
## API
	For this operation we have two Endpoint 
	-> Endpoint 1
		-> To get resturants list on the basis of search term, i.e most relevant at top 
		/relevant-resturants?searchTerm=seearchString
		(where searchString is the term on which database is searched)

		-> To get dishes list on the basis of search term, i.e most relevant at top 
		/relevant-dishes?searchTerm=seearchString
		(where searchString is the term on which database is searched)
4) Process a user purchasing a dish from a restaurant, handling all relevant data changes in an atomic transaction
## API
	-> /place-order/userid/:uid/resturantid/:rid/dishid/:did
	where :
	uid is the userid of the user placing the order,
	rid is the resturant id from which order is placed, 
	did is the dishid for which order is placed,

	-> APIs return errors/abort transaction if
		-> any of the api parameters is absent,
		-> user donot have enough cash balance,
		-> resturnat id is not present,
		-> dish id for that particular resturant is not present