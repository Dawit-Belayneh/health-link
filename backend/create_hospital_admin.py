import os
import sys
import argparse
import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from users.models import User
from hospitals.models import Hospital

def provision_hospital_admin(username, password, email, first_name, last_name, hospital_name):
    hospital, created = Hospital.objects.get_or_create(
        name=hospital_name,
        defaults={
            "address": "Bole Sub City, Ring Road, Addis Ababa",
            "phone": "+251115517000"
        }
    )
    if created:
        print(f"[+] Created hospital: {hospital.name}")
    else:
        print(f"[*] Found hospital: {hospital.name}")

    user, user_created = User.objects.get_or_create(
        username=username,
        defaults={
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "role": "admin",
            "is_staff": True,
        }
    )

    user.role = "admin"
    user.hospital = hospital
    user.is_staff = True
    user.email = email
    user.first_name = first_name
    user.last_name = last_name
    user.set_password(password)
    user.save()

    status_str = "Created new" if user_created else "Updated existing"
    print(f"[SUCCESS] {status_str} Hospital Admin account:")
    print(f"   - Username : {username}")
    print(f"   - Password : {password}")
    print(f"   - Role     : admin")
    print(f"   - Hospital : {hospital.name}")
    print(f"   - Full Name: {first_name} {last_name}")
    return user

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Provision a Hospital Administrator account (by Software Company owners).")
    parser.add_argument("--username", default="admin", help="Admin username (default: admin)")
    parser.add_argument("--password", default="AdminPass123!", help="Admin password (default: AdminPass123!)")
    parser.add_argument("--email", default="admin@centralhospital.com", help="Admin email")
    parser.add_argument("--first-name", default="Hospital", help="First name")
    parser.add_argument("--last-name", default="Administrator", help="Last name")
    parser.add_argument("--hospital", default="HealthLink Central Hospital", help="Hospital Name")

    args = parser.parse_args()

    print("=" * 65)
    print(" HEALTHLINK - HOSPITAL ADMIN PROVISIONING TOOL (SOFTWARE OWNERS)")
    print("=" * 65)
    provision_hospital_admin(
        username=args.username,
        password=args.password,
        email=args.email,
        first_name=args.first_name,
        last_name=args.last_name,
        hospital_name=args.hospital
    )
    print("=" * 65)
