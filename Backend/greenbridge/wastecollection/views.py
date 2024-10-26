from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import WasteCategory, WasteSubcategory, Location, Request
from .serializers import WasteCategorySerializer, WasteSubcategorySerializer, LocationSerializer, RequestSerializer

# WasteCategory API View

@api_view(['GET', 'POST'])
def waste_category_list_create(request):
    # GET: List all waste categories
    if request.method == 'GET':
        categories = WasteCategory.objects.all()
        serializer = WasteCategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    # POST: Create a new waste category
    elif request.method == 'POST':
        serializer = WasteCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def waste_category_detail(request, pk):
    try:
        category = WasteCategory.objects.get(pk=pk)
    except WasteCategory.DoesNotExist:
        return Response({"error": "Waste Category not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # GET: Retrieve a single waste category by ID
    if request.method == 'GET':
        serializer = WasteCategorySerializer(category)
        return Response(serializer.data)
    
    # PUT: Update a specific waste category
    elif request.method == 'PUT':
        serializer = WasteCategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # DELETE: Delete a specific waste category
    elif request.method == 'DELETE':
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# WasteSubcategory API View

@api_view(['GET', 'POST'])
def waste_subcategory_list_create(request):
    # GET: List all waste subcategories
    if request.method == 'GET':
        subcategories = WasteSubcategory.objects.all()
        serializer = WasteSubcategorySerializer(subcategories, many=True)
        return Response(serializer.data)
    
    # POST: Create a new waste subcategory
    elif request.method == 'POST':
        serializer = WasteSubcategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def waste_subcategory_detail(request, pk):
    try:
        subcategory = WasteSubcategory.objects.get(pk=pk)
    except WasteSubcategory.DoesNotExist:
        return Response({"error": "Waste Subcategory not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # GET: Retrieve a single waste subcategory by ID
    if request.method == 'GET':
        serializer = WasteSubcategorySerializer(subcategory)
        return Response(serializer.data)
    
    # PUT: Update a specific waste subcategory
    elif request.method == 'PUT':
        serializer = WasteSubcategorySerializer(subcategory, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # DELETE: Delete a specific waste subcategory
    elif request.method == 'DELETE':
        subcategory.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def request_list_create(request):
    if request.method == 'GET':
        requests = Request.objects.all()
        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = RequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def request_detail(request, pk):
    try:
        req = Request.objects.get(pk=pk)
    except Request.DoesNotExist:
        return Response({"error": "Request not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = RequestSerializer(req)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = RequestSerializer(req, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        req.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def approve_request(request, pk):
    try:
        req = Request.objects.get(pk=pk)
    except Request.DoesNotExist:
        return Response({"error": "Request not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.data.get('request_status') not in ['Approved', 'Rejected']:
        return Response({"error": "Invalid request status"}, status=status.HTTP_400_BAD_REQUEST)

    req.request_status = request.data.get('request_status')
    req.save()
    return Response({"message": f"Request {req.request_status}"})

@api_view(['PUT'])
def update_collection_status(request, pk):
    try:
        req = Request.objects.get(pk=pk)
    except Request.DoesNotExist:
        return Response({"error": "Request not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.data.get('collection_status') not in ['On the Way', 'Completed']:
        return Response({"error": "Invalid collection status"}, status=status.HTTP_400_BAD_REQUEST)

    req.collection_status = request.data.get('collection_status')
    req.save()
    return Response({"message": f"Collection Status {req.collection_status}"})

@api_view(['GET', 'POST'])
def location_list_create(request):
    # GET: List all locations
    if request.method == 'GET':
        locations = Location.objects.all()
        serializer = LocationSerializer(locations, many=True)
        return Response(serializer.data)

    # POST: Create a new location
    elif request.method == 'POST':
        serializer = LocationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def location_detail(request, pk):
    try:
        location = Location.objects.get(pk=pk)
    except Location.DoesNotExist:
        return Response({"error": "Location not found"}, status=status.HTTP_404_NOT_FOUND)

    # GET: Retrieve a single location by ID
    if request.method == 'GET':
        serializer = LocationSerializer(location)
        return Response(serializer.data)

    # PUT: Update a specific location
    elif request.method == 'PUT':
        serializer = LocationSerializer(location, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE: Delete a specific location
    elif request.method == 'DELETE':
        location.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)