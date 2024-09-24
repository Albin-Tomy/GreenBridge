from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from shg.models import SHG
from .serializers import AdminSHGApprovalSerializer
from rest_framework.permissions import IsAdminUser

class AdminSHGViewSet(viewsets.ModelViewSet):
    queryset = SHG.objects.filter(status='Pending')
    serializer_class = AdminSHGApprovalSerializer
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        shg = self.get_object()
        shg.status = 'Approved'
        shg.approved_by = request.user
        shg.save()
        return Response({'status': 'SHG approved'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        shg = self.get_object()
        shg.status = 'Rejected'
        shg.save()
        return Response({'status': 'SHG rejected'})
