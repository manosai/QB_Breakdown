from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'QB_Breakdown_site.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', 'QB_Breakdown_app.views.home')
)
